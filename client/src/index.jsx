import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game.jsx';
import Scoreboard from './components/Scoreboard.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app-container">
        <nav>
          <h1>SAVE GUDETAMA!</h1>
        </nav>  
        <div className="game-container">
          <Game />
          <Scoreboard />
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));