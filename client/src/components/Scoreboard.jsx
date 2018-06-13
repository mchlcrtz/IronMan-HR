import React from 'react';
import axios from 'axios';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'],
      counter: 0,
    } 
  }
  render() {
  	return (
      <div className="scoreboard">
        <h2 className="sbHeader">NORMAL HIGH SCORES</h2>
        <ul className="sbColumn left">RANK</ul>
        <ul className="sbColumn middle">NAME</ul>
        <ul className="sbColumn right">SCORE</ul>
        {this.props.scores.map((score, index) => 
          <div key={index}>  
            <ul className="sbColumn left">{this.state.rank[this.state.counter++]}</ul>
            <ul className="sbColumn middle">{score.username}</ul>
            <ul className="sbColumn right">{score.high_score}</ul>
          </div>
        )}
      </div>
  	) 
  }
} 

export default Scoreboard;