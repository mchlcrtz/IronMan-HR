var express = require('express');
var bodyParser = require('body-parser');
var {retrieveUsers, retrieveUserScores, addUserOrUpdateScore, get1000Words} = require('../database/index.js');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

// querying all users and scores from the database 
app.get('/wordgame', (req, res) => { 
  retrieveUsers(req.query, (data) => {
    res.send(data);
  });
});

// at end of game, add to or update db with username and high score
app.post('/wordgame', (req,res) => {
  console.log(req.body)
  addUserOrUpdateScore(req.body, (results) => {
    res.status(201).send(results);
  });
});

app.get('/userScores', (req, res) => {
  retrieveUserScores(req.query, (scores) => {
    res.send(scores)
  })
})

// get words from dictionary, send back to client
app.get('/dictionary', (req, res) => {
  get1000Words((results) => {
    res.send(results);
  });
});

app.get('/livePlayers', (req, res) => {
  res.send(livePlayers);
})

var port = process.env.PORT || 5000;

var server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

var io = require('socket.io')(server);

// an object to store what users are in what rooms
var rooms = {};
var livePlayers = {};

io.on('connection', (socket) => { 
  console.log('a user connected ', socket.id);
  
  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    
    delete livePlayers[socket.id];

    io.emit('player entered/left lobby', livePlayers);

    // removes user from room, if room has two users; deletes room if user is alone in it
    for (var room in rooms) {
      if (rooms[room].hasOwnProperty(socket.id)) {
        if (Object.keys(rooms[room]).length === 1) {
          delete rooms[room];
        } else {
          delete rooms[room][socket.id];
        }
      }
    }
    console.log('rooms: ', rooms);
  });
  
  // adds client to live playes and returns list of usernames that are currently looking for a match
  socket.on('entering multi player lobby', (username, cb) => {
    livePlayers[socket.id] = username;
    io.emit('player entered/left lobby', livePlayers);
    cb();
  })

  socket.on('leaving multi player lobby', username => {
    delete livePlayers[socket.id];
    io.emit('player entered/left lobby', livePlayers);
  })

  socket.on('challenging user', (data) => {
    io.to(data.challenged).emit('getting challenged', data.challenger);
  })

  socket.on('challenge accepted', (players) => {
    delete livePlayers[players.challenged.id];
    delete livePlayers[players.challenger.id];
    io.emit('player entered/left lobby', livePlayers);
    
  })

  // sends back the user a room for random player matching (supporting 100 rooms)
  socket.on('entering room', (username, cb) => {
    
    // removes player from livePlayers as he is getting matched to random opponent
    delete livePlayers[socket.id];

    // checking whether user is already in a room
    for (var room in rooms) {
      if(rooms[room].hasOwnProperty(socket.id)) return;
    }

    // if client is second player in the room, the game starts
    for(var i = 0; i < 100; i++) {
      if (rooms.hasOwnProperty(i) && Object.keys(rooms[i]).length === 1) {
          rooms[i][socket.id] = username;
          cb(i.toString());
          socket.join(i.toString());
          io.in(i.toString()).emit('startGame');
          console.log(`game starting in room ${i}. Players: ${Object.values(rooms[i])}`);
          console.log('rooms: ', rooms);
          return;
      } 
    }

    // if no one is waiting in a room, the user will be the first one waiting in a new room
    for(var i = 0; i < 100; i++) {
      if (!rooms.hasOwnProperty(i)) {
        rooms[i] = {
          [socket.id]: username
        };
        cb(i.toString());
        socket.join(i.toString());
        break;
      }
    }
  });

  socket.on('i lost', (data) => {
    console.log('losing...');
    socket.broadcast.to(data.room).emit('they lost', data.score);
  });

  socket.on('send words to opponent', function(data) {
    socket.broadcast.to(data.room).emit('receive words from opponent', data.newWords);
  });
});

