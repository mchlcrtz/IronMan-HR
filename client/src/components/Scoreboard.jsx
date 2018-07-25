import React from 'react';
import axios from 'axios';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: ['1ST', '2ND', '3RD', '4TH', '5TH'],
      counter: 0,
      userScore: []
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.username.length === 0 && this.state.userScore.length) {
      this.setState({
        userScore: []
      });
    } else if (this.state.userScore.length) {
      return;
    } else if (this.props.userScores.length > 0) {
      this.setState({
        userScore: this.props.userScores
      });
    }
  }
  render() {
    return (
      <div className="scoreboard">
        <h2 className="sbHeader">
          {this.props.mode.toUpperCase()} HIGH SCORES
        </h2>
        <ul className="sbColumn left">RANK</ul>
        <ul className="sbColumn middle">NAME</ul>
        <ul className="sbColumn right">SCORE</ul>
        {this.props.scores.map((score, index) => (
          <div key={index}>
            <ul className="sbColumn left">{this.state.rank[index]}</ul>
            <ul className="sbColumn middle">{score.username}</ul>
            <ul className="sbColumn right">{score.high_score}</ul>
          </div>
        ))}
        {this.state.userScore.length ? (
          <div>
            <h2 className="sbHeader">{this.props.username}</h2>
            {this.state.userScore.map((player, index) => (
              <div className="container" key={index}>
                <div className="item">{player.mode}</div>
                <div className="item">{player.high_score}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Scoreboard;
