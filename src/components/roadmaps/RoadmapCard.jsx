import React, { useRef } from 'react';

export default function RoadmapCard({ roadmap, index, onOpenRoadmap }) {
  const cardRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const card = cardRef.current;
    if (!card) return;

    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -7;
    const ry = (px - 0.5) * 7;
    card.style.transform = `translateY(-8px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = '';
    }
  };

  const handleCardClick = () => {
    if (!roadmap.comingSoon) {
      onOpenRoadmap(roadmap);
    }
  };

  return (
    <article
      ref={cardRef}
      className={`roadmap-card ${roadmap.comingSoon ? 'coming-soon' : ''}`}
      style={{
        '--accent': roadmap.accent,
        transitionDelay: `${index * 70}ms`,
        cursor: roadmap.comingSoon ? 'default' : 'pointer'
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleCardClick}
    >
      <div className="card-top-bar">
        <div className="roadmap-number">
          <b>0{index + 1}</b> / PATH
        </div>
        {roadmap.hasWorkshop && (
          <div className="card-workshop-badge" title="Includes recorded live workshop sessions">
            <i className="fa-solid fa-graduation-cap" />
            <span>Workshop</span>
          </div>
        )}
      </div>

      <div className="icon-box">
        <i className={`fa-solid ${roadmap.icon}`} />
      </div>

      <h3>{roadmap.title}</h3>
      <p>{roadmap.desc}</p>

      <div className="roadmap-tags">
        {(roadmap.tags || []).map((tag, i) => (
          <span key={i} className="roadmap-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="roadmap-spacer" />
      <div className="roadmap-line">
        <span />
      </div>

      <div className="card-footer">
        <span className="view">
          {roadmap.comingSoon ? 'COMING SOON' : 'OPEN ROADMAP'}
        </span>
        {roadmap.comingSoon ? (
          <div className="arrow" aria-hidden="true">
            <i className="fa-solid fa-lock" />
          </div>
        ) : (
          <button
            className="arrow"
            onClick={(e) => {
              e.stopPropagation();
              onOpenRoadmap(roadmap);
            }}
            aria-label={`Open ${roadmap.title} roadmap`}
          >
            <i className="fa-solid fa-arrow-right" />
          </button>
        )}
      </div>
    </article>
  );
}
