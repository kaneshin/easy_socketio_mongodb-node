
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.search = function(req, res){
  res.render('search', { title: 'Express' })
};

exports.register = function(req, res){
  res.render('register', { title: 'Express' })
};

exports.delete = function(req, res){
  res.render('delete', { title: 'Express' })
};

