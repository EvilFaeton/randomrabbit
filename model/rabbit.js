var mongoose = require('mongoose');

var rabbitSchema = mongoose.Schema({
  url: String,
  date: Number,
  size: Object,
  hash: String
});

rabbitSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

module.exports = mongoose.model('Rabbit', rabbitSchema);