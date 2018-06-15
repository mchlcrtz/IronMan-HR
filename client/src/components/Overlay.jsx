import React from 'react';

class Overlay extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){

      // checks if prompt is string or array
      if(typeof this.props.prompt === 'string') {
        var prompt = <div id="overlay-start" onClick={(e) => this.props.choosePlayersMode(e)} className="blinking">{this.props.prompt}</div>;
      } else {
        var prompt = <div id="overlay-start" onClick={(e) => this.props.choosePlayersMode(e)} className="blinking">
                        {this.props.prompt.map((item, i) => {
                          return <div className="overlay-prompt" key={i}>{item}</div>
                        })}
                     </div>
      }

      // checks if we are in selecting opponent phase
      if(this.props.prompt === 'PLAY RANDOM OPPONENT') {
        var players = this.props.livePlayers.map((player, i) => {
          return <div key={i} onClick={(e)=> this.props.challenge(e)}>{player}</div>
        });
        var instr = <div>Players Online</div>;
      } else {
        var players = instr = null;
      }

      return(
        <div id="overlay">
          <div>{this.props.instructions.map((line, index) => {
            // audio effect:
            playStart();
            return (<span key={index}>{line}<br></br></span>)
          })}</div>
          <div id="crackedegg"></div>
          <div>
            {/* "getReady" waits for 2 players, "startGame" (on click) is 1 player */}
            <form id="starter-form" autoComplete="off">
              <input id="user-input" placeholder="Who are you?" value={this.props.username} onChange={this.props.handleUserNameChange} autoFocus/>
            </form>
          </div>
          {instr}
          {players}
          {prompt}
        </div>
      )
    }
}

export default Overlay;