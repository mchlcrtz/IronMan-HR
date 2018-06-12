import React from 'react';
import Brick from './Brick.jsx';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io();

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      dictionary: {},
      words: [],
      theirWords: [],
      time: 0,
      timeInterval: 1000,
      round: 'all',
      instructions: ["Humpty Dumpty sat on a wall,", "Humpty Dumpty had a great fall.", "All the king's horses and all the king's men", "Couldn't put Humpty together again.", "HURRY - KEEP TYPING TO PREVENT HIS DEMISE!"],
      prompt: 'START GAME',
      opponentTime: 0
    }
    
    this.getReady = this.getReady.bind(this);
    this.startGame = this.startGame.bind(this);
    this.addWord = this.addWord.bind(this);
    this.updateOpponentWordList = this.updateOpponentWordList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendScore = this.sendScore.bind(this);
    this.stopGame = this.stopGame.bind(this);

    var c = io.connect(process.env.PORT, {query: this.state.time})
    console.log('c', c)

    socket.on('receive words from opponent', (words) => {
      this.updateOpponentWordList(words);
    });
    socket.on('startGame', () => {
      this.startGame();
    });
    socket.on('they lost', (score) => {
      // this is bad, eventually put a red x over their bricks or something
      this.setState({
        opponentTime: score,
      })
      document.getElementById('their-game').style.backgroundColor = "red";
    });
  }

  // get words from dictionary and join socket
  componentDidMount() {
    axios.get('/dictionary')
    .then(results => {
      this.setState({
        dictionary: results.data,
      })
    }).catch(err => {
      console.error(err);
    });
    socket.emit('entering room', {
      room: this.props.room, 
      username: this.props.username
    });
  }

  // sends your words to opponent
  componentDidUpdate(prevProps, prevState) {
    if (this.state.words.length !== prevState.words.length) {
      socket.emit('send words to opponent', {
        room: this.props.room,
        newWords: this.state.words,
      }); 
    }
  }

  // leave socket
  componentWillUnmount() {  
    socket.emit('leaving room', {
      room: this.props.room,
      username: this.props.username,
    });
  }

  // hides starter form and user input, waits for another player to start game
  getReady(e) {
    e.preventDefault();
    document.getElementById('starter-form').disabled = true;
    document.getElementById('user-input').disabled = true;
    this.setState({
      prompt: 'WAITING...',
    });
    socket.emit('ready', {
      room: this.props.room, 
      username: this.props.username
    });
  }

  startGame() {
    document.getElementById('typing-input').disabled = false;
    document.getElementById('typing-input').focus();
    document.getElementById('overlay').style.display = "none";
    document.getElementById('their-game').style.backgroundColor = "transparent";
    document.getElementById('gudetama').style = {
      display: "inline-block",
      backgroundColor: "none",
    };
    document.getElementById('their-gudetama').style = {
      display: "inline-block",
      backgroundColor: "none",
    };

    // long function to define what happens at every interval
    var go = () => {
      // creates a loop by calling itself:
      var step = setTimeout(() => {
        go();
      }, this.state.timeInterval);

      // adds a brick:
      this.addWord();

      // ends game or changes background color of gudetama based on length of "words" array
      // (as bricks build up, background turns a darker red to signify danger)
      if (this.state.words.length >= 20) {
        clearTimeout(step);
        //console.log('opponent time',this.state.time)
        socket.emit('i lost', {
          room: this.props.room, 
          username: this.props.username, 
          score: this.state.time
        });
        this.stopGame();
      } else if (this.state.words.length > 15) {
        document.getElementById('gudetama').style.backgroundColor = "rgba(255, 0, 0, 1)";
      } else if (this.state.words.length > 10) {
        document.getElementById('gudetama').style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      }

      // updates the time and speeds up the game accordingly 
      // (as timeInterval decreases, words appear at a faster rate)
      var newTime = this.state.time + 1;
      if (newTime > 20) {
        this.setState({
          time: newTime,
          timeInterval: 600,
          //round: 'roundThree', // uncomment these to only serve short words at beginning, long words at end
        });
      } else if (newTime > 8) { 
        this.setState({
          time: newTime,
          timeInterval: 800,
          //round: 'roundTwo',
        });
      } else {
        this.setState({
          time: newTime,
          //round: 'roundOne',
        });
      }
    }

    // blank slate, then start!
    this.setState({
      words: [],
      time: 0,
      timeInterval: 1000,
      userInput: '',
    }, () => go());
  
  }

  // pulls random word from dictionary obj and adds it to words state
  addWord() {
    var availableWords = this.state.dictionary[this.state.round];
    var newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    this.setState({
      words: [...this.state.words, newWord]
    });
  }

  // updates your view of opponent's words
  updateOpponentWordList(words) {
    this.setState({
      theirWords: words
    })
  }

  // updates userInput with what user is currently typing
  handleChange(e) {
    this.setState({
      userInput: e.target.value,
    })
  }

  // when the user hits "enter"
  handleSubmit(e) {
    e.preventDefault();
    var submittedWord = this.state.userInput;
    var index = this.state.words.indexOf(submittedWord);
    
    // check if what they typed is in our "words" array
    // flash green for a correctly typed word and remove word from "words" array
    if (index !== -1) {
      document.getElementById('typing-input').style.backgroundColor = "green";
      var newWords = this.state.words.slice();
      newWords.splice(index, 1);
      playCorrect(); 
      this.setState({
        words: newWords,
      });
    } else {
      // else flash red for a mistyped word
      playWrong(); 
      document.getElementById('typing-input').style.backgroundColor = "red";
    }

    setTimeout(() => {
      document.getElementById('typing-input').style.backgroundColor = "white";
    }, 100);

    this.setState({
      userInput: '',
    });
  }

  // upon game over, sends username and score to database to be added/updated
  sendScore(username, score) {
    axios.post('/wordgame', {
      "username": username,
      "high_score": score
    })
    .then(result => {
      console.log(result);
    }).catch(err => {
      console.error(err);
    })
  }

  stopGame() {
    document.getElementById('typing-input').disabled = true;
    document.getElementById('overlay').style.display = "block";
    document.getElementById('gudetama').style.display = "none";
    document.getElementById('their-gudetama').style.display = "none";
    document.getElementById('starter-form').disabled = false;
    document.getElementById('user-input').disabled = false;

    // enables user to hit "enter" after 2 seconds to restart game
    setTimeout(() => {
      if (document.getElementById('overlay').display !== "none") {
        document.getElementById('user-input').focus();
      }
    }, 2000);
    
    this.sendScore(this.props.username, this.state.time);
 
    // audio effect
    playGameOver();
    
    this.setState({
      // maybe find a way to compare your score vs opponent's score and show YOU WIN/YOU LOSE
      instructions: ['GAME OVER', `YOU SCORED: ${this.state.time}`, `YOUR OPPONENT SCORED: ${this.state.opponentTime}`],
      prompt: 'REPLAY',
    });
  }

  render() {
    return (
      <div className="game">
        <div id="overlay">
          <div>{this.state.instructions.map((line, index) => {
            // audio effect:
            playStart();
            return (<span key={index}>{line}<br></br></span>)
          })}</div>
          <div id="crackedegg"></div>
          <div>
            {/* "getReady" waits for 2 players, "startGame" (on click) is 1 player */}
            <form id="starter-form" onSubmit={this.getReady} autoComplete="off">
              <input id="user-input" placeholder="Who are you?" value={this.props.username} onChange={this.props.handleUserNameChange} autoFocus/>
            </form>
          </div>
          <div id="overlay-start" onClick={this.startGame} className="blinking">{this.state.prompt}</div>
        </div>
    
        <div className="timer">
          <h1>{this.state.time}</h1>
        </div>

        <div className="board">
          {/* your game: */}
          <div className="play"> 
            {this.state.words.map((word, index) => {
              return <Brick word={word} key={index} />
            })}
            <div id="gudetama"></div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <input id="typing-input" value={this.state.userInput} onChange={this.handleChange} />
            </form>
          </div>

          {/* their game: */}
          <div className="play" id="their-game"> 
            {this.state.theirWords.map((word, index) => {
              return <Brick word={word} key={index} />
            })}
            <div id="their-gudetama"></div>
            <form autoComplete="off">
              <input value="OPPONENT" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Game;