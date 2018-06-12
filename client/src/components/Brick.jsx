import React from 'react';

const Brick = (props) => {
  return (
    <div className={`brick ${props.powerup}`}>
      <p>{props.word}</p>
    </div>
  )
}

export default Brick;