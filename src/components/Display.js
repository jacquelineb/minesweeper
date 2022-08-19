import React, { useEffect, useState } from 'react';
import mine_icon from '../assets/mine_icon.png';
import timer from '../assets/timer.png';
import style from '../styles/Display.module.scss';

const Display = ({ time, numMines, status, onClick }) => {
  const [statusBtn, setStatusBtn] = useState({ animation: null, text: '' });
  useEffect(() => {
    console.log('status changed');
    if (status === 'W') {
      setStatusBtn({ animation: style.bounce, text: 'YOU WON!' });
    } else if (status === 'L') {
      setStatusBtn({ animation: style.shakeX, text: 'YOU LOST!' });
    } else {
      setStatusBtn({ animation: null, text: 'NEW GAME' });
    }
  }, [status]);

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
      <div>
        <button className={`${style.button} ${statusBtn.animation}`} onClick={onClick}>
          {statusBtn.text}
        </button>
      </div>
      <div>
        <img src={timer} alt={'Timer icon'} />
        <span>{displayedTime}</span>
      </div>
    </div>
  );
};

export default Display;
