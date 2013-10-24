Q = require('q');
tumblr = require('tumblr.js');

client = new tumblr.Client({
  consumer_key: 'xZmCSwOVeFqgFZynxNRCyR0BS6h1edqYFxGSWYZwwkgMMsoKEB',
  consumer_secret: 'hMyLELaYPLyZaMaOOWxRRkMIS03GXvdMvPAIy3iZSHzOdTRQuX'
});

function TumblerAdapter(request) {
  this.request = request;
}

TumblerAdapter.prototype = {
  scrap: function(processed, limit) {
    var defer = Q.defer();
    client.tagged(this.request, { before: processed, limit: limit }, function(error, result) {
      if(error) {
        return defer.reject();
      }
      var images = result.map(function(img) {
        if(!img.photos) {
          return null;
        }
        var photo = img.photos[0];
        return {
          url: photo.original_size.url,
          size: {
            width: photo.original_size.width,
            height: photo.original_size.height
          },
          date: img.timestamp
        };
      });
      defer.resolve(images.filter(function(el) { return el; }));
    });
    return defer.promise;
  }
};

module.exports = TumblerAdapter;