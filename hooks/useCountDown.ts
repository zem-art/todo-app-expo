import { useEffect, useState, useRef } from 'react';

export const useCountdown = (initialSeconds: number = 300) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setSecondsRemaining(initialSeconds);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      stop();
    }
  }, [secondsRemaining]);

  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return {
    secondsRemaining,
    isActive,
    formatTime,
    start,
    stop,
  };
};
