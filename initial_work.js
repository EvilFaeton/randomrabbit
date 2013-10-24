var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/randomrabbit');
Rabbit = require('./model/rabbit');

var Scrapper = require('./service/scrapper');
var sources = [{
  source: 'tumblr',
  request: 'bunny gif'
}, {
  source: 'tumblr',
  request: 'rabbit gif'
}];
var RabbitScrapper = new Scrapper(sources);
var limit = 100;
var maxRuns = 200;
var runs = 0;
function work(processed, limit) {
  runs++;
  RabbitScrapper.scrap(processed, limit).then(function(count) {
    console.log('done ' + processed);
    count = count.concat.apply([], count);
    count = count.reduce(function(a, b) { return a + b; }, 0);
    console.log('now really processed ' + count);
    if(count === 0 || maxRuns < runs) {
      mongoose.connection.close();
      return false;
    }
    setTimeout(function() {
      Rabbit.findOne({}, {}, { sort: { 'date' : 1 } }, function(err, rabbit) {
        work(rabbit.date, limit);
      });
    }, 60000);
  });
}

work(0, limit);