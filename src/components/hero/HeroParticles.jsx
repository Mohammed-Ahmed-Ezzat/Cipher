import React, { useMemo } from 'react';

export default function HeroParticles() {
  const particles = useMemo(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 14;
    return Array.from({ length: count }, (_, i) => {
      const isGold = Math.random() > 0.75;
      const left = Math.random() * 100;
      const duration = 13 + Math.random() * 16;
      const delay = Math.random() * 10;
      const drift = Math.random() * 90 - 45;
      const size = 1.5 + Math.random() * 2.2;

      return {
        id: i,
        className: `hero-particle ${isGold ? 'gold' : ''}`,
        style: {
          left: `${left}%`,
          bottom: '-10px',
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--drift': `${drift}px`,
          width: `${size}px`,
          height: `${size}px`
        }
      };
    });
  }, []);

  return (
    <div id="heroParticles" aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className={p.className} style={p.style} />
      ))}
    </div>
  );
}
