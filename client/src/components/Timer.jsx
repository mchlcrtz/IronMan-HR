import React from 'react'

class Timer extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return (

        
        <div className="timer">
          <h1>{this.props.time}</h1>
        </div>
        )
    }
}

export default Timer