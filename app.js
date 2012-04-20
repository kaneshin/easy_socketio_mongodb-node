
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Easy = require(__dirname + '/public/javascripts/schema.js')
  , socketio = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/search', routes.search);
app.get('/register', routes.register);
app.get('/remove', routes.remove);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


// My Configuration

var io = socketio.listen(app);

io.sockets.on('connection', function(socket) {

  // Event: search
  socket.on('search', function(data) {
    Easy.find({"title": data}, function(err, result) {
      if ( !err ) socket.emit('search list', result);
    });
  });

  socket.on('register', function(data) {
    var easy = new Easy();
    easy.title = data;
    easy.date = new Date();
    easy.save(function(err) { if( err ) console.log(err); });
    socket.broadcast.emit('registered', data);
    Easy.find({}, function(err, result) {
      if ( !err ) socket.broadcast.emit('rewrite remove list', result);
    });
  });

  socket.on('remove', function(id) {
    // remove data of _id from mongodb
    Easy.remove({"_id": id}, function(err) { if( err ) console.log(err); });
    // need to rewrite other client
    Easy.find({}, function(err, result) {
      console.log(result);
      if ( !err ) socket.broadcast.emit('rewrite remove list', result);
    });
  });
});


