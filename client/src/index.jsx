import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      mode: 'easy',
      scores: [],
      userScores: []
    }
    this.handleUserNameChange = this.handleUserNameChange.bind(this);   
    this.handleMode = this.handleMode.bind(this)
    this.updateScoreboard = this.updateScoreboard.bind(this)
    this.updateUserScores = this.updateUserScores.bind(this)
  }

  handleUserNameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleMode(difficulty) {
    this.setState({
      mode: difficulty
    })
  }
  updateUserScores(){
    axios.get('/userScores', {params: {username: this.state.username}})
    .then((results) => {
      this.setState({
        userScores: results.data
      })
    })
  }
  updateScoreboard() {
  	axios.get("/wordgame", {params: {mode: this.state.mode}})
  	.then((results) => {
  		this.setState({
  			scores: results.data
  		});
    });
  }
  componentDidMount(){
    this.updateScoreboard();
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.mode !== this.state.mode) {
      this.updateScoreboard()
    }
    if(prevState.username !== this.state.username){
      this.updateUserScores()
    }
  }

  render() {
    return (
      <div className="app-container">
        <nav>
          <h1>SAVE GUDETAMA!</h1>
        </nav>  
        <div className="game-container">
          <Game 
          username={this.state.username} handleUserNameChange={this.handleUserNameChange}
          mode = {this.state.mode} handleMode = {this.handleMode}
          updateScoreboard = {this.updateScoreboard}
          />
          <Scoreboard mode = {this.state.mode} scores = {this.state.scores} userScores = {this.state.userScores} username = {this.state.username}/>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));