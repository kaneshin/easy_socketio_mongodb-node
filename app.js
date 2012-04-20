
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

  // event: search
  socket.on('search', function(data) {
    Easy.find({"title": data}, function(err, result) {
      if( err ) {
        console.log(err);
      } else {
        socket.emit('search list', result);
      }
    });
  });

  // event: register
  socket.on('register', function(data) {
    var easy = new Easy();
    easy.title = data;
    easy.date = new Date();
    easy.save(function(err) {
      if( err ) {
        console.log(err);
      } else {
          socket.broadcast.emit('registered', data);
      }
    });
    Easy.find({}, function(err, result) {
      if( err ) {
        console.log(err);
      } else {
        socket.emit('data list', result);
        socket.broadcast.emit('data list', result);
        socket.broadcast.emit('remove list', result);
      }
    });
  });

  // event: remove
  socket.on('remove', function(id) {
    Easy.remove({"_id": id}, function(err) {
      if( err ) {
        console.log(err);
      } else {
        Easy.find({}, function(err, result) {
          if( err ) {
            console.log(err);
          } else {
            socket.broadcast.emit('data list', result);
            socket.broadcast.emit('remove list', result);
          }
        });
      }
    });
  });

});


