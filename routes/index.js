
/*
 * GET home page.
 */

var Easy = require(__dirname + '/../public/javascripts/schema.js');

exports.index = function(req, res) {
  Easy.find({}, function(err, result) {
    if ( !err ) {
      res.render('index', {
        title: 'Express'
       ,datas: result
      });
    }
  });
};

exports.search = function(req, res){
  res.render('search', { title: 'Search' })
};

exports.register = function(req, res){
  res.render('register', { title: 'Register' })
};

exports.remove = function(req, res){
  Easy.find({}, function(err, result) {
    if ( !err ) {
      res.render('remove', { title: 'Remove', chunk: result });
    }
  });
};

