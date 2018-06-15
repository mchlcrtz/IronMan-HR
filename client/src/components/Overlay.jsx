import React from 'react';

class Overlay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          instructions:["Humpty Dumpty sat on a wall,", "Humpty Dumpty had a great fall.", "All the king's horses and all the king's men", "Couldn't put Humpty together again.", "HURRY - KEEP TYPING TO PREVENT HIS DEMISE!"],
          mode: 'easy'
        }
        this.handleMode = this.handleMode.bind(this)
    }
    handleMode(e){
      this.setState({
        mode: e.target.value
      }, () => {
        this.props.handleMode(this.state.mode)
      })
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
        var players = Object.keys(this.props.livePlayers).map((id) => {
          return <div id={id} key={id} className="playerName" onClick={(e)=> this.props.challenge(e)}>{this.props.livePlayers[id]}</div>
        })
        var instr = <div>Players Online</div>;
      } else {
        var players = instr = null;
      }

      return(
        <div id="overlay">
          <div>{this.state.instructions.map((line, index) => {
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
          {this.props.prompt === 'START GAME' &&
          <select value = {this.state.mode} onChange = {this.handleMode}>
            <option value = 'easy'>Easy</option>
            <option value = 'medium'>Medium</option>
            <option value = 'hard'>Hard</option>
          </select>
          }
          {instr}
          {players}
          {prompt}
        </div>
      )
    }
}

export default Overlay;