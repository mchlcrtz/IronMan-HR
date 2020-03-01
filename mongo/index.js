const mongoose = require("mongoose");
const mongoDB = "mongodb://localhost/pokemon";

const db = mongoose.connect(mongoDB, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const get1000Words = callback => {
  let wordsString = "";
  const readStream = fs.createReadStream(
    path.join(__dirname, "/dictionary.txt"),
  );
  readStream.on("data", chunk => {
    wordsString += chunk;
  });

  readStream.on("end", () => {
    const dictionary = {
      all: [],
      roundOne: [],
      roundTwo: [],
      roundThree: [],
    };

    // this is to handle Windows computers, which add '\r' at the end of every line:
    if (wordsString.slice(0, 20).includes("\r\n")) {
      dictionary.all = wordsString.split("\r\n");
    } else {
      dictionary.all = wordsString.split("\n");
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
      let j, x, i;
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
};

// retrieve top 10 users and their high scores
const retrieveUsers = function({ mode }, callback) {};

const retrieveUserScores = ({ username }, callback) => {};

//check if a user has played before, and add or update accordingly
const addUser = function(userWithScore, callback) {};

module.exports = { db };
