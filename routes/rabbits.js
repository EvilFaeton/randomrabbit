Rabbit = require('../model/rabbit');

exports.indexJSON = function(req, res) {
  Rabbit.random(function(err, rabbit) {
    if(err) {
      res.send({ error: 'Something went wrong'})
    } else {
      res.send({
        url: rabbit.url,
        size: rabbit.size
      });
    }
  })
};