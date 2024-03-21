import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [targetDateTime, setTargetDateTime] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timerRunning, setTimerRunning] = useState(false);
  const [countdownOver, setCountdownOver] = useState(false);
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
          setCountdownOver(true);
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
    setCountdownOver(false);
    if (!targetDateTime) {
      setErrorMessage('Please select a date and time.');
      return;
    }

    const selectedDateTime = new Date(targetDateTime).getTime();
    const currentDateTime = new Date().getTime();

    if (selectedDateTime <= currentDateTime) {
      setErrorMessage('Please select a future date and time.');
      return;
    }

    const distance = selectedDateTime - currentDateTime;
    if (distance > 100 * 24 * 60 * 60 * 1000) {
      setErrorMessage('Selected time is more than 100 days.');
      return;
    }

    setErrorMessage('');
    
    setTimerRunning(true);
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
      <h1 className="title">Countdown Timer</h1>
      <div className="input-container">
        <input
          type="datetime-local"
          value={targetDateTime}
          onChange={handleDateTimeChange}
          min={new Date().toISOString().split('.')[0]} // Current datetime as min
          step="1" // Set step to 1 to remove seconds from the picker
        />
        <button className="start-button" onClick={handleStartTimer} disabled={!targetDateTime}>
          Start Timer
        </button>
      </div>
      {timerRunning ? (
        <div className="countdown-container">
          <div className="countdown">
            <div className="countdown-item">{countdown.days} days</div>
            <div className="countdown-item">{countdown.hours} hours</div>
            <div className="countdown-item">{countdown.minutes} minutes</div>
            <div className="countdown-item">{countdown.seconds} seconds</div>
          </div>
          <button className="cancel-button" onClick={handleCancelTimer}>Cancel Timer</button>
        </div>
      ) : null}
      {countdownOver && !timerRunning && (
        <div className="countdown-over">The Countdown is Over</div>
      )}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
}

export default App;
