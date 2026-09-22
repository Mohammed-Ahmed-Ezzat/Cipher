import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    let animationFrame;
    const start = performance.now();
    const duration = 1300;

    const animateLoader = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(eased * 100);
      setProgress(val);

      if (t < 1) {
        animationFrame = requestAnimationFrame(animateLoader);
      } else {
        setTimeout(() => {
          setHide(true);
          if (onComplete) onComplete();
        }, 250);
      }
    };

    animationFrame = requestAnimationFrame(animateLoader);

    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  return (
    <div className={`loader ${hide ? 'hide' : ''}`} aria-hidden={hide}>
      <div className="loader-inner">
        <div className="loader-ring"></div>
        {!logoError ? (
          <img
            className="loader-logo"
            src="https://i.ibb.co/bg25xHM5/Cipher.png"
            alt="Cipher Logo"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="loader-logo-fallback">
            <i className="fa-solid fa-terminal"></i>
          </div>
        )}
        <div className="loader-status">Initializing Cipher</div>
        <div className="loader-percent">
          <span>{progress}</span>%
        </div>
        <div className="loader-tip">mapping your next move...</div>
      </div>
    </div>
  );
}
