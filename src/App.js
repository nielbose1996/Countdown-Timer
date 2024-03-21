import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [targetDateTime, setTargetDateTime] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timerRunning, setTimerRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(targetDateTime).getTime() - now;

        if (distance <= 0) {
          clearInterval(interval);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setTimerRunning(false);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setCountdown({ days, hours, minutes, seconds });
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning, targetDateTime]);

  const handleStartTimer = () => {
    const selectedDateTime = new Date(targetDateTime).getTime();
    const currentDateTime = new Date().getTime();

    if (selectedDateTime <= currentDateTime) {
      setErrorMessage('Please select a future date and time.');
    } else {
      setErrorMessage('');
      setTimerRunning(true);
    }
  };

  const handleCancelTimer = () => {
    setTimerRunning(false);
    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setErrorMessage('');
  };

  const handleDateTimeChange = (e) => {
    setTargetDateTime(e.target.value);
  };

  return (
    <div className="App">
      <h1>Countdown Timer</h1>
      <input
        type="datetime-local"
        value={targetDateTime}
        onChange={handleDateTimeChange}
        min={new Date().toISOString().split('.')[0]} // Current datetime as min
        step="1" // Set step to 1 to remove seconds from the picker
      />
      {timerRunning ? (
        <>
          <div className="countdown">
            <div>{countdown.days} days</div>
            <div>{countdown.hours} hours</div>
            <div>{countdown.minutes} minutes</div>
            <div>{countdown.seconds} seconds</div>
          </div>
          <button onClick={handleCancelTimer}>Cancel Timer</button>
        </>
      ) : (
        <button onClick={handleStartTimer}>Start Timer</button>
      )}
      {(!timerRunning && countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) && (
        <div>The Countdown is Over</div>
      )}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
}

export default App;
