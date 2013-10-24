TumblrAdapter = require('./tumblr_adapter');
Q = require('q');
Rabbit = require('../model/rabbit');
crypto = require('crypto');

Scrapper = function(sources) {
  this.sources = sources;
};

Scrapper.prototype = {

  getAdapters: function() {
    return {
      tumblr: TumblrAdapter
    };
  },

  mixhash: function(json) {
    var md5 = crypto.createHash('md5');
    md5.update(json.url);
    json.hash = md5.digest('hex');
    return json;
  },

  checkAndSave: function(defer, json) {
    Rabbit.find({ hash: json.hash.toString() }, function(err, result) {
      if(result.length > 0 || err) {
        return defer.resolve(0);
      }
      var fluffy = new Rabbit(json);
      fluffy.save(function() {
        defer.resolve(1);
      });
    });
  },

  save: function(json) {
    return Q.all(json.map(this.mixhash.bind(this)).map(function(rabbitJson) {
      var defer = Q.defer();
      this.checkAndSave(defer, rabbitJson);
      return defer.promise;
    }.bind(this)));
  },

  scrap: function(processed, limit) {
    var adapters = this.getAdapters();
    var adapter;

    return Q.all(this.sources.map(function(source) {
      if(adapters[source.source]) {
        adapter = new adapters[source.source](source.request);
        return adapter.scrap(processed, limit).then(this.save.bind(this));
      } else {
        return Q();
      }
    }.bind(this)));
  }

};

module.exports = Scrapper;