import {Component} from 'react'

class Timer extends Component {
    constructor(porps) {
        super(props)
    }
    render(){
        <div className="timer">
          <h1>{this.props.time}</h1>
        </div>
    }
}

export default Timer