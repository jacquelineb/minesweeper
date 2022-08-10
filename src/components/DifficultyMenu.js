import React, { useState } from 'react';
import style from '../styles/DifficultyMenu.module.scss';
import { DIFFICULTIES } from '../utils/constants';

const DifficultyMenu = ({ currDifficulty, selectDifficulty }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div
      className={style.container}
      onClick={() => setDropdownIsActive((prevState) => !prevState)}
    >
      <div>{currDifficulty.level}</div>
      <ul
        className={`${style.difficultyList} ${!dropdownIsActive ? style.hidden : null}`}
        onMouseLeave={() => {
          setDropdownIsActive(false);
        }}
      >
        {DIFFICULTIES.map((difficulty) => {
          return (
            <li onClick={() => selectDifficulty({ ...difficulty })}>{difficulty.level}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default DifficultyMenu;
