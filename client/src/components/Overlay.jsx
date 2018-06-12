import React from 'react'

class Overlay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          instructions:["Humpty Dumpty sat on a wall,", "Humpty Dumpty had a great fall.", "All the king's horses and all the king's men", "Couldn't put Humpty together again.", "HURRY - KEEP TYPING TO PREVENT HIS DEMISE!"],
          prompt:'START GAME',
          mode: 'Easy'
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
      return (
        <div id="overlay">
          <div>{this.state.instructions.map((line, index) => {
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
          <select value = {this.state.mode} onChange = {this.handleMode}>
            <option value = 'Easy'>Easy</option>
            <option value = 'Medium'>Medium</option>
            <option value = 'Hard'>Hard</option>
          </select>
          <div id="overlay-start" onClick={this.props.startGame} className="blinking">{this.state.prompt}</div>
        </div>
      )
    }
}

export default Overlay
