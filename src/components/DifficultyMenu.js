import React, { useState } from 'react';
import { DIFFICULTIES } from '../utils/constants';
import style from '../styles/DifficultyMenu.module.scss';

const DifficultyMenu = ({ currDifficulty, selectDifficulty }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div
      className={style.container}
      onMouseLeave={() => {
        setDropdownIsActive(false);
      }}
    >
      <div
        className={style.menuToggler}
        onClick={() => setDropdownIsActive((prevState) => !prevState)}
      >
        {currDifficulty.level.toUpperCase()}
      </div>
      <ul className={`${style.difficultyList} ${!dropdownIsActive ? style.hidden : null}`}>
        {DIFFICULTIES.map((difficulty, idx) => {
          return (
            <li
              key={idx}
              className={style.dropdownItem}
              onClick={() => {
                selectDifficulty({ ...difficulty });
                setDropdownIsActive(false);
              }}
            >
              {difficulty.level.toUpperCase()}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DifficultyMenu;
