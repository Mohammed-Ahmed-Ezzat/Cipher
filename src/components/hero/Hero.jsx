import React, { useEffect, useState, useRef } from 'react';
import ThreeCanvas from './ThreeCanvas';
import { siteConfig } from '../../data/siteConfig';

export default function Hero() {
  const [counts, setCounts] = useState({ paths: 0, community: 0, showInfinity: false });
  const metaRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const metaEl = metaRef.current;
    if (!metaEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();
          const duration = 900;

          const animateNumbers = (now) => {
            const p = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - p, 3);

            setCounts({
              paths: Math.floor(eased * 6),
              community: Math.floor(eased * 1),
              showInfinity: p > 0.6
            });

            if (p < 1) {
              requestAnimationFrame(animateNumbers);
            } else {
              setCounts({ paths: 6, community: 1, showInfinity: true });
            }
          };

          requestAnimationFrame(animateNumbers);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(metaEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" id="home">
      <ThreeCanvas />
      <div className="hero-orb" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="container-xl hero-content">
        <div className="eyebrow">
          <span className="pulse-dot" />
          STUDENT • TECH • COMMUNITY
        </div>

        <h1>
          Choose Your <span className="gradient">Path.</span>
          <br />
          Build Your Future.
        </h1>

        <p>
          Clear learning directions for students who want to explore technology, build real
          skills, and know what to learn next.
        </p>

        <div className="actions">
          <a href="#roadmaps" className="btn-main">
            Explore Roadmaps <i className="fa-solid fa-arrow-down" />
          </a>
          <a href="#intro" className="btn-ghost">
            Meen Cipher <i className="fa-solid fa-arrow-right" />
          </a>
        </div>

        <div className="hero-meta" ref={metaRef}>
          <div className="meta">
            <strong>{String(counts.paths).padStart(2, '0')}</strong>
            <span>Learning Paths</span>
          </div>
          <div className="meta">
            <strong>{String(counts.community).padStart(2, '0')}</strong>
            <span>Community</span>
          </div>
          <div className="meta">
            <strong className={`infinity-count ${counts.showInfinity ? 'pop' : ''}`}>
              ∞
            </strong>
            <span>Potential</span>
          </div>
        </div>
      </div>

      <div className="scroll-cue" id="scrollCue">
        Scroll to explore <i className="fa-solid fa-chevron-down" />
      </div>

      <div className="hero-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,60 L1440,0 L1440,60 Z" fill="#031817" />
          <path d="M0,60 L1440,0" stroke="rgba(32,240,208,.16)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </section>
  );
}
