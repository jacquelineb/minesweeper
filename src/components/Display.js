import React from 'react';
import style from '../styles/Display.module.scss';
import mine_icon from '../assets/mine_icon.png';
import timer from '../assets/timer.png';

const Display = ({ time, numMines, status, onClick }) => {
  let displayedTime;
  if (time >= 3600) {
    displayedTime = '99:99';
  } else {
    displayedTime = new Date(time * 1000).toISOString().substring(14, 19);
  }
  return (
    <div className={style.container}>
      <div>
        <img src={mine_icon} alt='Potential number of mines remaining' />
        <span>{numMines}</span>
      </div>
      <button className={style.button} onClick={onClick}>
        {status === 'L' ? 'You lost!' : status === 'W' ? 'You won!' : 'NEW GAME'}
      </button>
      <div>
        <img src={timer} alt={'Time lapsed'} />
        <span>{displayedTime}</span>
      </div>
    </div>
  );
};

export default Display;
