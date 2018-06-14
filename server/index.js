var express = require('express');
var bodyParser = require('body-parser');
var {retrieveUsers, addUserOrUpdateScore, get1000Words} = require('../database/index.js');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

// querying all users and scores from the database 
app.get('/wordgame', (req, res) => { 
  retrieveUsers((data) => {
    res.send(data);
  });
});

// at end of game, add to or update db with username and high score
app.post('/wordgame', (req,res) => {
  addUserOrUpdateScore(req.body, (results) => {
    res.status(201).send(results);
  });
});

// get words from dictionary, send back to client
app.get('/dictionary', (req, res) => {
  get1000Words((results) => {
    res.send(results);
  });
});



var port = process.env.PORT || 5000;

var server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

var io = require('socket.io')(server);

// an object to store what users are in what rooms
var rooms = {};

// count the players in each room
// var getPlayerCount = (roomName) => {
//   var playerCount = 0;
//   for (var player in rooms[roomName]) {
//     playerCount += rooms[roomName][player];
//   }
//   return playerCount;
// }

// all socket logic:
io.on('connection', (socket) => { 
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  // sends back the user a room for random player matching (supporting 100 rooms)
  socket.on('entering room', (username, cb) => {
    // if client is second player in the room, the game starts
    for(var i = 0; i < 100; i++) {
      if (rooms.hasOwnProperty(i) && rooms[i].length === 1) {
        rooms[i].push(username);
        cb(i.toString());
        socket.join(i.toString());
        io.in(i.toString()).emit('startGame');
        console.log(`game starting in room ${i}. Players: ${rooms[i]}`);
        console.log('rooms: ', rooms);
        return;
      }
    }
    for(var i = 0; i < 100; i++) {
      if (!rooms.hasOwnProperty(i)) {
        rooms[i] = [username];
        cb(i.toString());
        socket.join(i.toString());
        break;
      }
    }
  });

  socket.on('leaving room', (data) => {
    console.log("leaving room");
    socket.leave(data.room);
    var i = rooms[data.room].indexOf(data.username);
    rooms[data.room].splice(i, 1);
    if (rooms[data.room].length === 0) {
      delete rooms[data.room];
    }
    console.log('leaving room, rooms is', rooms);
  });

  // if client is second user in room, game starts
  // socket.on('ready', (data) => {
  //   // if (!rooms[data.room]) {
  //   //   rooms[data.room] = {};
  //   // }; 
  //   rooms[data.room][data.username] = 1; 
  //   console.log('ready, rooms is', rooms);
  //   if (getPlayerCount(data.room) === 2) { //start the game with 2 players in the room
  //     io.in(data.room).emit('startGame');
  //   }
  // });

  socket.on('i lost', (data) => {
    socket.broadcast.to(data.room).emit('they lost', data.score);
  });

  socket.on('send words to opponent', function(data) {
    socket.broadcast.to(data.room).emit('receive words from opponent', data.newWords);
  });
});
