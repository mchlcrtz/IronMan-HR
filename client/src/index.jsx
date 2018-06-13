import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: 'scottVsLina',
      username: '',
      mode: 'easy',
      scores: []
    }
    this.handleUserNameChange = this.handleUserNameChange.bind(this);   
    this.handleMode = this.handleMode.bind(this)
    this.updateScoreboard = this.updateScoreboard.bind(this)
  }

  handleUserNameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleMode(mode) {
    this.setState({
      mode
    })
  }
  updateScoreboard() {
  	axios.get("/wordgame", {params: {mode:this.state.mode}})
  	.then((results) => {
  		this.setState({
  			scores: results.data
  		});
    });
  }
  componentDidMount(){
    this.updateScoreboard()
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.mode !== this.state.mode) {
      console.log('updated scoreboard')
      this.updateScoreboard()
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
          room={this.state.room} 
          username={this.state.username} handleUserNameChange={this.handleUserNameChange}
          mode = {this.state.mode} handleMode = {this.handleMode}
          />
          <Scoreboard scores = {this.state.scores}/>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));