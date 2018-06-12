import {Component} from 'react'

class Overlay extends Component {
    constructor(porps) {
        super(props)
    }
    render(){
        <div id="overlay">
          <div>{this.props.instructions.map((line, index) => {
            // audio effect:
            playStart();
            return (<span key={index}>{line}<br></br></span>)
          })}</div>
          <div id="crackedegg"></div>
          <div>
            {/* "getReady" waits for 2 players, "startGame" (on click) is 1 player */}
            <form id="starter-form" onSubmit={this.props.getReady} autoComplete="off">
              <input id="user-input" placeholder="Who are you?" value={this.props.username} onChange={this.props.handleUserNameChange} autoFocus/>
            </form>
          </div>
          <div id="overlay-start" onClick={this.props.startGame} className="blinking">{this.props.prompt}</div>
        </div>
    }
}

export default Overlay
