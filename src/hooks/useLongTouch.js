import { useEffect, useState } from 'react';

const useLongTouch = (callback = () => {}, ms = 500) => {
  const [startPress, setStartPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startPress) {
      timerId = setInterval(() => {
        callback();
        setStartPress(false);
      }, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startPress]);

  return {
    onTouchStart: () => setStartPress(true),
    onTouchEnd: () => setStartPress(false),
  };
};

export default useLongTouch;
