const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// var credentials = process.env.host;
// if(credentials === undefined){
//   credentials = require('./../config.js');
// } else {
//   credentials = {
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database
//   }
// }

// const connection = mysql.createConnection({
//   host: 'ironman.crb3zmhwoovo.us-east-1.rds.amazonaws.com',
//   user: 'IronMan', 
//   password: 'IronMan-HR', 
//   database: 'humptydumpty',
//   port: 3306,
//   timeout: 6000,
// });

const connection = mysql.createConnection({
  database: 'humptydumpty',
  user: 'root',
  password: '',
})
// const connection = mysql.createConnection({
//   host: credentials.host,
//   user: credentials.user,
//   password: credentials.password, 
//   database: credentials.database,
//   port: 3306,
//   timeout: 6000,
// });

connection.connect(function(err) {
  if (err) {
    throw err;
  } else {
    console.log("Connected!");
  }
});

// very annoying, but this just reads dictionary.txt, splits it into an array of words, shuffles, and builds dictionary object to send back to client
var get1000Words = (callback) => {
  var wordsString = '';
  var readStream = fs.createReadStream(path.join(__dirname, '/dictionary.txt'));
  readStream.on('data', (chunk) => {
    wordsString += chunk;
  });

  readStream.on('end', () => {
    var dictionary = {
      all: [],
      roundOne: [],
      roundTwo: [],
      roundThree: [],
    };

    // this is to handle Windows computers, which add '\r' at the end of every line:
    if (wordsString.slice(0, 20).includes('\r\n')) {
      dictionary.all = wordsString.split('\r\n');
    } else {
      dictionary.all = wordsString.split('\n');
    }
    
    // adds each word to rounds 1, 2, or 3 based on word length
    for (var i = 0; i < dictionary.all.length; i++) { 
      if (dictionary.all[i].length < 5) {
        dictionary.roundOne.push(dictionary.all[i]);
      } else if (dictionary.all[i].length < 8) {
        dictionary.roundTwo.push(dictionary.all[i]);
      } else {
        dictionary.roundThree.push(dictionary.all[i]);
      } 
    }

    function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
    }

    shuffle(dictionary.all);
    shuffle(dictionary.roundOne);
    shuffle(dictionary.roundTwo);
    shuffle(dictionary.roundThree);

    dictionary.all = dictionary.all.slice(0, 1000);
    dictionary.roundOne = dictionary.roundOne.slice(0, 400);
    dictionary.roundTwo = dictionary.roundTwo.slice(0, 300);
    dictionary.roundThree = dictionary.roundThree.slice(0, 300);

    callback(dictionary);
  });
}

//FUNCTIONS TO INTERACT WITH DATABASE:

// retrieve top 10 users and their high scores
const retrieveUsers = function({mode},callback) {
  let queryStr = `SELECT * FROM users WHERE mode = '${mode}' ORDER BY high_score DESC LIMIT 5`;
    connection.query(queryStr, (err, data) => {
    if (err) {
      console.log('DB: error retrieving users', err);
    } else {
      callback(data);
    } 
  });
};

const retrieveUserScores = ({username}, callback) => {
  let queryStr = `SELECT * FROM users WHERE username = '${username}'`;
  connection.query(queryStr, (err, data) => {
    if (err) {
      console.log(`DB: Error retrieving ${username}'s scores`)
    } else {
      callback(data)
    }
  })
} 

// retrieve high score for a certain user
// const retrieveHighScore = function(user, callback) {
//   let queryStr = `SELECT high_score FROM users WHERE username = '${user.username}'`;
//   connection.query(queryStr, (err, data) => {
//     if(err) console.log('DB: error retrieving high score for a certain user', err);
//     callback(data);
//   });
// };

//check if a user has played before, and add or update accordingly
const addUserOrUpdateScore = function(userWithScore, callback) {
  let queryStr = `SELECT * FROM users WHERE username = '${userWithScore.username}' and mode = '${userWithScore.mode}'`;
  connection.query(queryStr, (err, result) => {
    if (err) {
      console.error('error retrieving user from database', err);
    } else {
      if (result.length === 0) {
        // if new user, add them to the database
        let queryStr2 = `INSERT INTO users (username, high_score, mode) VALUES ('${userWithScore.username}', ${userWithScore.high_score}, '${userWithScore.mode}')`;
        connection.query(queryStr2, (err) => {
          if (err) {
            console.error('error inserting high score into DB', err);
          } else {
            callback('inserted user into db');
          }
        });
      } else {
        // else only update if user beat their personal best score in same mode
        let queryStr3 = `UPDATE users SET high_score = ${userWithScore.high_score} WHERE username='${userWithScore.username}' AND high_score <= ${userWithScore.high_score} AND mode = '${userWithScore.mode}'`;
        connection.query(queryStr3, (err, result) => {
          if (err) {
            console.error('error updating high score', err);
          } else if (result.changedRows === 0){
            callback('Did not update score')
          } else {
            callback('updated high score');
          }
        });
      }
    }
  })  
}

//export all database functions here 
module.exports = {
  retrieveUsers,
  addUserOrUpdateScore,
  get1000Words,
  retrieveUserScores
};