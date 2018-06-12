import React from 'react';

class Overlay extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
      if(typeof this.props.prompt === 'string') {
        var prompt = <div id="overlay-start" onClick={(e) => this.props.choosePlayersMode(e)} className="blinking">{this.props.prompt}</div>;
      } else {
        var prompt = <div id="overlay-start" onClick={(e) => this.props.choosePlayersMode(e)} className="blinking">
                        {this.props.prompt.map((item, i) => {
                          return <div className="overlay-prompt" key={i}>{item}</div>
                        })}
                     </div>
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
          {prompt}
        </div>
      )
    }
}

export default Overlay;