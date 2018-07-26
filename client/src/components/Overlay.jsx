import React from 'react';

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'easy'
    };
    this.handleMode = this.handleMode.bind(this);
  }
  handleMode(e) {
    var difficulty = e.target.id;

    this.setState(
      {
        mode: difficulty
      },
      () => {
        this.props.handleMode(difficulty);
      }
    );
  }
  render() {
    // checks if prompt is string or array
    if (typeof this.props.prompt === 'string') {
      var prompt = (
        <div
          id="overlay-start"
          onClick={e => this.props.choosePlayersMode(e)}
          className="blinking"
        >
          {this.props.prompt}
        </div>
      );
    } else {
      var prompt = (
        <div
          id="overlay-start"
          onClick={e => this.props.choosePlayersMode(e)}
          className="blinking"
        >
          {this.props.prompt.map((item, i) => {
            return (
              <div className="overlay-prompt" key={i}>
                {item}
              </div>
            );
          })}
        </div>
      );
    }

    // checks if we are in selecting opponent phase
    if (this.props.prompt === 'PLAY RANDOM OPPONENT') {
      var players = Object.keys(this.props.livePlayers).map(id => {
        return (
          <div
            id={id}
            key={id}
            className="playerName"
            onClick={e => this.props.challenge(e)}
          >
            {this.props.livePlayers[id]}
            <span class="dot" />
          </div>
        );
      });
      if (players.length === 0) {
        players = (
          <div className="noLivePlayers" style={{ color: 'lightcoral' }}>
            No players online
          </div>
        );
      }
      var onlinePlayersHeader = (
        <div className="playersHeader">Challenge Online Players:</div>
      );
    } else {
      var players = (onlinePlayersHeader = null);
    }

    return (
      <div id="overlay">
        <div>
          {this.props.instructions.map((line, index) => {
            // audio effect:
            playStart();
            return (
              <span key={index}>
                {line}
                <br />
              </span>
            );
          })}
        </div>
        <div id="crackedegg" />
        <div>
          {/* "getReady" waits for 2 players, "startGame" (on click) is 1 player */}
          <form id="starter-form" autoComplete="off">
            <input
              id="user-input"
              placeholder="Who are you?"
              value={this.props.username}
              onChange={this.props.handleUserNameChange}
              autoFocus
            />
          </form>
        </div>
        {onlinePlayersHeader}
        {players && (
          <div className="playersWrapper">
            {players}
            <p className="or">or</p>
          </div>
        )}
        {this.props.prompt === 'START GAME' ? null : prompt}
        {this.props.prompt === 'START GAME' && (
          <ul
            className="difficulty-wrapper blinking"
            onClick={e => this.handleMode(e)}
          >
            <li className="difficulty" id="easy">
              Easy
            </li>
            <li className="difficulty" id="medium">
              Medium
            </li>
            <li className="difficulty" id="hard">
              Hard
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default Overlay;
