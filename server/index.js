var express = require('express');
var bodyParser = require('body-parser');
var {retrieveUsers, retrieveUserScores, addUserOrUpdateScore, get1000Words} = require('../database/index.js');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

// querying all users and scores from the database 
app.get('/wordgame', (req, res) => { 
  retrieveUsers(req.query, (data) => {
    console.log(data)
    res.send(data);
  });
});

// at end of game, add to or update db with username and high score
// this should only create a new user
app.post('/wordgame', (req,res) => {
  addUserOrUpdateScore(req.body, (results) => {
    res.status(201).send(results);
  });
});

// update score of exisiting user

app.put('/wordgame', (req, res) => {
  updateScore(req,body, (results) => {
    res.status(201).send(results)
  })
})

// retrieve user scores from database
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

var port = process.env.PORT || 5000;

var server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

/////// SOCKET FUNCTIONALITY BELOW ///////
var io = require('socket.io')(server);

// rooms object that is in-sync with socket.io rooms
var rooms = {};

// players in multi player lobby, that can be challenged
var livePlayers = {};

io.on('connection', (socket) => { 
  console.log('a user connected ', socket.id);
  
  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    delete livePlayers[socket.id];
    io.emit('player entered/left lobby', livePlayers);

    // Removes disconnected user from room, if room has two users. Deletes room if user is alone in it
    for (var room in rooms) {
      if (rooms[room].hasOwnProperty(socket.id)) {
        if (Object.keys(rooms[room]).length === 1) {
          delete rooms[room];
        } else {
          delete rooms[room][socket.id];
        }
      }
    }
  });
  
  // adds client to live playes and returns list of usernames that are currently looking for a match
  socket.on('entering multi player lobby', (username, cb) => {
    livePlayers[socket.id] = username;
    io.emit('player entered/left lobby', livePlayers);
    cb();
  })

  // removes user from multiplayer lobby and communicates the change to all clients
  socket.on('leaving multi player lobby', username => {
    delete livePlayers[socket.id];
    io.emit('player entered/left lobby', livePlayers);
  })

  // receives challenge request from challenger, creates a room for the match, should it happen and forwards the request to challenged player
  socket.on('challenging user', (data) => {
    for(var i = 0; i < 100; i++) {
      if (!rooms.hasOwnProperty(i)) {
        rooms[i] = {
          [data.challenger.id]: data.challenger.username
        };
        socket.join(i.toString());
        data.room = i;
        break;
      }
    }
    io.to(data.challenged.id).emit('getting challenged', data);
  })

  // receives response to challenge request
  socket.on('challenge response', (data) => {
    // if challenge accepted, removes players from lobby, adds challenged player to room and starts game
    if (data.response === true) {
      delete livePlayers[data.challenged.id];
      delete livePlayers[data.challenger.id];
      io.emit('player entered/left lobby', livePlayers);
      rooms[data.room][data.challenged.id] = data.challenged.username; 
      socket.join(data.room.toString());
      io.in(data.room.toString()).emit('startGame', data.room.toString());
      console.log(`game starting in room ${data.room}. Players: ${Object.values(rooms[data.room])}`);
    } else {
      // replies to challenger that challenged user denied and clears the room
      io.of('/').in(data.room.toString()).clients((error, socketIds) => {
        if (error) throw error;
        socketIds.forEach(socketId => {
          socket.broadcast.to(socketId).emit('challenge denied', data.challenged.username);
          io.sockets.sockets[socketId].leave('chat');
        });
      });
      delete rooms[data.room];
    }
  });

  // adds user to a room for multiplayer game random matching
socket.on('entering room', (username) => {
    
    // removes player from livePlayers as he is getting matched to random opponent
    delete livePlayers[socket.id];

    // checking whether user is already in a room from previous matches and clears the room
    for (var room in rooms) {
      if(rooms[room].hasOwnProperty(socket.id)) {
        delete rooms[room];
      }
    }

    // if somebody is waiting already, client joins that room, the game starts
    for(var i = 0; i < 100; i++) {
      if (rooms.hasOwnProperty(i) && Object.keys(rooms[i]).length === 1) {
          rooms[i][socket.id] = username;
          //cb(i.toString());
          socket.join(i.toString());
          io.in(i.toString()).emit('startGame', i.toString());
          console.log(`game starting in room ${i}. Players: ${Object.values(rooms[i])}`);
          return;
      } 
    }

    // if no one is waiting in a room, the user will be the first one waiting in a new room
    for(var i = 0; i < 100; i++) {
      if (!rooms.hasOwnProperty(i)) {
        rooms[i] = {
          [socket.id]: username
        };
        //cb(i.toString());
        socket.join(i.toString());
        break;
      }
    }
  });

  // sends user's score to opponent
  socket.on('i lost', (data) => {
    socket.broadcast.to(data.room).emit('they lost', data.score);
  });

  // send current list of words to opponent (during game)
  socket.on('send words to opponent', function(data) {
    socket.broadcast.to(data.room).emit('receive words from opponent', data.newWords);
  });
});

