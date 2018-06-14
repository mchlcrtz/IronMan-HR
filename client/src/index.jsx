import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game.jsx';
import Scoreboard from './components/Scoreboard.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
    this.handleUserNameChange = this.handleUserNameChange.bind(this);   
  }

  handleUserNameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  render() {
    return (
      <div className="app-container">
        <nav>
          <h1>SAVE GUDETAMA!</h1>
        </nav>  
        <div className="game-container">
          <Game username={this.state.username} handleUserNameChange={this.handleUserNameChange}/>
          <Scoreboard />
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));