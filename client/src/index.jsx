import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game.jsx';
import Scoreboard from './components/Scoreboard.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: 'scottVsLina',
      username: '',
      mode: 'easy'
    }
    this.handleUserNameChange = this.handleUserNameChange.bind(this);   
    this.handleMode = this.handleMode.bind(this)
  }

  handleUserNameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  handleMode(mode) {
    this.setState({
      mode
    })
  }

  render() {
    return (
      <div className="app-container">
        <nav>
          <h1>SAVE GUDETAMA!</h1>
        </nav>  
        <div className="game-container">
          <Game room={this.state.room} username={this.state.username} handleUserNameChange={this.handleUserNameChange}/>
          <Scoreboard mode = {this.state.mode} handleMode = {this.state.mode}/>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));