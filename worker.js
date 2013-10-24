// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/randomrabbit');

var Scrapper = require('./service/scrapper');
var sources = [{
  source: 'tumblr',
  request: 'bunny gif'
}, {
  source: 'tumblr',
  request: 'rabbit gif'
}];
var RabbitScrapper = new Scrapper(sources);

function work() {
  RabbitScrapper.scrap(0, 20).then(function() {
    console.log('done');
    setTimeout(work, 360000);
  });
}

work();