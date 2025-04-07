import React, { useState, useEffect } from 'react';
import '../styles/AuctionCountdown.css';


const AuctionCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="auction-countdown">
      <h2>Auction Starts In</h2>
      <div className="countdown-timer">
        <div className="countdown-box">
          <span className="number">{timeLeft.days}</span>
          <span className="label">Days</span>
        </div>
        <div className="countdown-box">
          <span className="number">{timeLeft.hours}</span>
          <span className="label">Hours</span>
        </div>
        <div className="countdown-box">
          <span className="number">{timeLeft.minutes}</span>
          <span className="label">Minutes</span>
        </div>
        <div className="countdown-box">
          <span className="number">{timeLeft.seconds}</span>
          <span className="label">Seconds</span>
        </div>
      </div>
    </section>
  );
};

export default AuctionCountdown;