import React from 'react';
import Brick from './Brick.jsx';
import Overlay from './Overlay.jsx';
import Timer from './Timer.jsx'
import axios from 'axios';
import PowerBank from './PowerBank.jsx';

import { EEXIST } from 'constants';
const io = require('socket.io-client'); 
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
      modeInterval: 700,
      round: 'all',
      prompt: 'START GAME',
      opponentTime: 0,
<<<<<<< HEAD
      mode: 'easy'
=======
      powerups: {},
      bankedPowers: []
>>>>>>> dev
    }
    
    this.getReady = this.getReady.bind(this);
    this.startGame = this.startGame.bind(this);
    this.addWord = this.addWord.bind(this);
    this.updateOpponentWordList = this.updateOpponentWordList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendScore = this.sendScore.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.handleMode = this.handleMode.bind(this)


    this.pauseGame = this.pauseGame.bind(this);
    this.removeWords = this.removeWords.bind(this);
    this.shuffleArray = this.shuffleArray.bind(this);
    this.switchWords = this.switchWords.bind(this);

    this.removeAllWords = this.removeAllWords.bind(this);
    this.stopAll = this.stopAll.bind(this);
    this.usePower = this.usePower.bind(this);
    this.addPower = this.addPower.bind(this);
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
  handleMode(mode){
    console.log(mode)
    this.setState({mode}, 
      () => this.props.handleMode(mode))
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
          timeInterval: this.state.modeInterval,
          // round: 'roundThree' // uncomment these to only serve short words at beginning, long words at end
        });
      } else if (newTime > 8) { 
        this.setState({
          time: newTime,
          timeInterval: this.state.modeInterval,
          // round: 'roundOne'
        });
      } else {
        this.setState({
          time: newTime,
          // round: 'roundOne',
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
    this.addPower(newWord);
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
    var powerups;
    var deposit;
    // check if what they typed is in our "words" array
    // flash green for a correctly typed word and remove word from "words" array
    if (index !== -1) {
    
      document.getElementById('typing-input').style.backgroundColor = "green";
      var newWords = this.state.words.slice();
      newWords.splice(index, 1);
      playCorrect();

      if(this.state.powerups[submittedWord] != undefined){
        powerups = Object.assign({}, this.state.powerups);
        deposit = powerups[submittedWord];
        delete powerups[submittedWord];
    
        if(this.state.bankedPowers.length != 0){
          deposit = [...this.state.bankedPowers, deposit]
        } else {
          deposit = [deposit];
        }

        this.setState({
          words: newWords,
          bankedPowers: deposit,
          powerups: powerups
        });

      } else { 
        this.setState({
          words: newWords,
        });
      }
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
  sendScore(username, score, mode) {
    axios.post('/wordgame', {
      "username": username,
      "high_score": score,
      "mode": mode
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
    
    this.sendScore(this.props.username, this.state.time,this.state.mode);
 
    // audio effect
    playGameOver();
    
    this.setState({
      // maybe find a way to compare your score vs opponent's score and show YOU WIN/YOU LOSE
      instructions: ['GAME OVER', `YOU SCORED: ${this.state.time}`, `YOUR OPPONENT SCORED: ${this.state.opponentTime}`],
      prompt: 'REPLAY',
    });
  }
  
  //ADDED FOR POWERUPS
  pauseGame(){
    var previousInterval = this.state.timeInterval;
    setInterval(()=>{
      this.setState({
        timeInterval: previousInterval
      });
    },5000);
    this.setState({
      timeInterval: 5000
    });
  }

  shuffleArray(arr){
    var current = arr.length;
    var temp;
    var rand;

    while(current !== 0){
      rand = Math.floor(Math.random() * current);
      current--;
      temp = arr[current];
      arr[current] = arr[rand];
      arr[rand] = temp;
    }  
    return arr;
  }

  removeWords(num){
    var removeWords = this.state.words.slice();
    var half = Math.floor(removeWords.length/2);
    removeWords = this.shuffleArray(removeWords);
    removeWords = removeWords.slice(0, half);
    this.setState({
      words: removeWords
    });
  }

  switchWords(){
    var list = this.state.words.slice();
    list.pop();
    list.push("aaa");
    this.setState({
      words: list
    });
  }
  removeAllWords(num){
    this.setState({
      words: []
    });
  }
  usePower(e){
    var temp;
    var banked;
    if(e.keyCode === 32){
      temp = e.target.value;
      temp = temp.substring(0, temp.length-1);
     
      if(this.state.bankedPowers[0] != undefined){
        if(this.state.bankedPowers[0] === 'power0'){
          this.removeAllWords();
        } else if(this.state.bankedPowers[0] === 'power1'){
          this.pauseGame();
        } else if(this.state.bankedPowers[0] === 'power2'){
          this.removeWords();
        }
        banked = this.state.bankedPowers.slice();
        banked.shift(); 
      }
      this.setState({
        userInput: temp,
        bankedPowers: banked
      })
    }
  }

  addPower(word){
    var chance = 8; //1 in chance
    var rand = Math.floor(Math.random() * chance) + 1;
    var current;
    if(rand === 1){
      if(Object.keys(this.state.powerups).length === 0){
        current = {};
      } else {
        current = this.state.powerups;
      }

      current[word] = "power" + Math.floor(Math.random() * 3);
      this.setState({
        powerups: current
      })
    }
  }

  stopAll(){
    this.setState({
      timeInterval: 100000
    });
  }
  //END OF POWERUPS

  render() {
    return (
      <div className="game">
        <Overlay 
          instructions = {this.state.instructions} 
          getReady = {this.getReady} 
          username = {this.props.username} 
          handleUserNameChange = {this.props.handleUserNameChange}
          startGame = {this.startGame}
          prompt = {this.state.prompt}
          handleMode = {this.handleMode}
        />
    
<<<<<<< HEAD
        <Timer time = {this.state.time}/>
=======
        <div className="timer">
          <h1>{this.state.time}</h1>
          {/*<h4>GOD MODE</h4><button id='button-stopall' onClick={this.stopAll}>STOPALL</button>
          <button id='button-pause' onClick={this.pauseGame}>PAUSE</button>
          <button id='button-removeWords' onClick={()=>this.removeWords(3)}>REMOVE</button>
        <button id='button-switchWords' onClick={this.switchWords}>SWITCH</button>*/}
        </div>
>>>>>>> dev

        <div className="board">
          {/* your game: */}
          <div className="play"> 
            {this.state.words.map((word, index) => {
              return <Brick word={word} key={index} powerup={this.state.powerups[word] ? this.state.powerups[word] : ""}/>
            })}
            <div id="gudetama"></div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <input id="typing-input" type='text' value={this.state.userInput} onChange={this.handleChange} onKeyUp={this.usePower}/>
            </form>
          </div>

          <div id="power-bank">
            <h5>Powers:</h5>
            {this.state.bankedPowers.map((powerup, index)=>{
              return <PowerBank key={index} powerup={powerup} />
            })}
            <div id='legend'>
              <div className='power1'>Pause (5s)</div>
              <div className='power2'>Remove 1/2</div>
              <div className='power0'>Remove All</div>
            </div>
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