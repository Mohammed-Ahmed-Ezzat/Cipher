import React, { useState, useEffect } from 'react';
import LocalPdfViewer from './LocalPdfViewer';
import { sfx } from '../../utils/soundEffects';

export default function WorkshopStudio({ workshop, accent = '#5be0ff' }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeView, setActiveView] = useState('video'); // 'video' | 'slides'
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [playerMode, setPlayerMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMobileWidth = window.innerWidth <= 768;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return (isMobileWidth || isMobileUA) ? 'direct' : 'embed';
    }
    return 'embed';
  });

  if (!workshop || !workshop.sessions || workshop.sessions.length === 0) {
    return (
      <div className="workshop-empty">
        <i className="fa-solid fa-graduation-cap" />
        <p>Workshop sessions will be announced soon.</p>
      </div>
    );
  }

  const currentSession = workshop.sessions[selectedDayIndex] || workshop.sessions[0];

  useEffect(() => {
    // Safety timer: Dismiss skeleton after 3.5s if onLoad is delayed or blocked by mobile privacy shields
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [selectedDayIndex, reloadKey]);

  useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth > 768 && currentWidth <= 768) {
        setPlayerMode('direct');
      } else if (prevWidth <= 768 && currentWidth > 768) {
        setPlayerMode('embed');
      }
      prevWidth = currentWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectDay = (index) => {
    sfx.playClick();
    setSelectedDayIndex(index);
    setIsVideoLoading(true);
  };

  const handleToggleView = (view) => {
    sfx.playClick();
    setActiveView(view);
  };

  const handleReloadVideo = () => {
    sfx.playClick();
    setIsVideoLoading(true);
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="workshop-studio-root" data-lenis-prevent="true">
      {/* Workshop Navigation Header */}
      <div className="workshop-top-controls">
        <div className="workshop-day-selector">
          {workshop.sessions.map((session, idx) => (
            <button
              key={session.day}
              className={`workshop-day-pill ${selectedDayIndex === idx ? 'active' : ''}`}
              onClick={() => handleSelectDay(idx)}
              style={{
                '--pill-accent': accent
              }}
            >
              <span className="day-number">0{session.day}</span>
              <span className="day-label">Day {session.day}</span>
              {session.date && <span className="day-date">{session.date}</span>}
            </button>
          ))}
        </div>

        {/* View Switcher: Video vs Slides */}
        <div className="workshop-view-switch">
          <button
            className={`view-switch-btn ${activeView === 'video' ? 'active' : ''}`}
            onClick={() => handleToggleView('video')}
            title="Watch recorded live session"
          >
            <i className="fa-solid fa-play" />
            <span>Watch Video</span>
          </button>
          <button
            className={`view-switch-btn ${activeView === 'slides' ? 'active' : ''}`}
            onClick={() => handleToggleView('slides')}
            title="View session presentation slides"
          >
            <i className="fa-solid fa-file-powerpoint" />
            <span>Session Slides</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workshop-main-viewport">
        {activeView === 'video' ? (
          <div className="workshop-video-pane">
            <div className="video-theater-wrapper" style={{ '--theater-accent': accent }}>
              <div className="video-ambient-glow" />

              {/* Player Mode Switcher Tabs */}
              <div className="stage-player-mode-tabs">
                <button
                  type="button"
                  className={`player-mode-tab ${playerMode === 'direct' ? 'active' : ''}`}
                  onClick={() => {
                    sfx.playClick();
                    setPlayerMode('direct');
                  }}
                  title="Direct high-speed video player"
                >
                  <i className="fa-solid fa-bolt" />
                  <span>Instant Player</span>
                  <span className="player-tab-chip">Fast & Direct</span>
                </button>
                <button
                  type="button"
                  className={`player-mode-tab ${playerMode === 'embed' ? 'active' : ''}`}
                  onClick={() => {
                    sfx.playClick();
                    setPlayerMode('embed');
                  }}
                  title="Embedded in-page video player"
                >
                  <i className="fa-solid fa-window-maximize" />
                  <span>Embedded Player</span>
                </button>
              </div>

              {playerMode === 'direct' ? (
                /* Cinematic Direct Mobile Player Stage */
                <div className="stage-iframe-holder direct-mode modal-direct-holder">
                  <div className="direct-player-backdrop">
                    <div className="direct-player-glow" />
                  </div>

                  <a
                    href={currentSession.videoDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="direct-play-hero-btn"
                    title="Launch session video stream"
                    onClick={() => sfx.playClick()}
                  >
                    <div className="direct-play-circle">
                      <i className="fa-solid fa-play" />
                    </div>
                    <div className="direct-play-meta">
                      <span className="direct-play-heading">Play Recorded Workshop</span>
                      <span className="direct-play-subtext">
                        <i className="fa-solid fa-bolt" /> 1080p Full HD • Instant Smooth Stream
                      </span>
                      <span className="direct-play-prompt">
                        Click to stream via Google Drive Player <i className="fa-solid fa-arrow-up-right-from-square" />
                      </span>
                    </div>
                  </a>

                  <div className="direct-player-footer">
                    <span className="direct-track-tag">
                      <i className="fa-solid fa-video" /> Live Stream
                    </span>
                    <span className="direct-session-tag">
                      Session {currentSession.day} • {currentSession.date}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="video-iframe-container">
                  {isVideoLoading && (
                    <div className="video-skeleton">
                      <div className="video-spinner" />
                      <span>Connecting to Google Drive Stream...</span>
                    </div>
                  )}

                  <div className="stage-floating-launch-bar">
                    <a
                      href={currentSession.videoDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="floating-launch-btn"
                      title="Launch video in high-definition native player"
                      onClick={() => sfx.playClick()}
                    >
                      <i className="fa-brands fa-google-drive" />
                      <span>Launch Stream (1080p)</span>
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>

                  <iframe
                    key={`${currentSession.videoUrl}-${reloadKey}`}
                    src={currentSession.videoUrl}
                    title={currentSession.title}
                    className="workshop-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="eager"
                    onLoad={() => setIsVideoLoading(false)}
                  />
                </div>
              )}

              {/* In-Modal Player Bottom Helper */}
              <div className="stage-player-helper modal-variant">
                <div className="helper-hint">
                  <i className="fa-solid fa-circle-info" />
                  <span>
                    Chrome DevTools touch mode drops clicks on iframes. Use <b>Instant Player</b> above or click <b>Open in Drive</b> for 1-click playback.
                  </span>
                </div>
                <a
                  href={currentSession.videoDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="helper-direct-link"
                >
                  <i className="fa-brands fa-google-drive" />
                  <span>Open in Drive</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
              </div>
            </div>

            {/* Video Meta Info Bar */}
            <div className="workshop-meta-bar">
              <div className="meta-info-left">
                <span className="session-badge">
                  <i className="fa-solid fa-video" /> Live Recording
                </span>
                <h4 className="session-title">{currentSession.title}</h4>
                <div className="session-subline">
                  <span>
                    <i className="fa-regular fa-calendar" /> {currentSession.date}
                  </span>
                  <span>•</span>
                  <span>
                    <i className="fa-solid fa-user-tie" /> {workshop.instructor}
                  </span>
                </div>
              </div>

              <div className="meta-actions-right">
                <a
                  href={currentSession.videoDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mini-btn workshop-action-btn drive-highlight"
                  title="Open video directly in Google Drive"
                >
                  <i className="fa-brands fa-google-drive" />
                  <span>Open in Drive</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
                <button
                  className="mini-btn workshop-action-btn highlight"
                  onClick={() => handleToggleView('slides')}
                  title="Read presentation slides for this session"
                >
                  <i className="fa-solid fa-file-pdf" />
                  <span>Read Slides</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Slides Deck Mode rendered using Local Canvas Viewer */
          <div className="workshop-slides-pane">
            <div className="slides-header-bar">
              <div className="slides-title-info">
                <span className="session-badge">
                  <i className="fa-solid fa-file-pdf" /> Presentation Slides
                </span>
                <h4>{currentSession.slidesTitle || `${currentSession.title} - Slides`}</h4>
              </div>
              <div className="slides-actions">
                <button
                  className="mini-btn workshop-action-btn"
                  onClick={() => handleToggleView('video')}
                  title="Return to video recording"
                >
                  <i className="fa-solid fa-play" />
                  <span>Back to Video</span>
                </button>
                <a
                  href={currentSession.slidesDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mini-btn workshop-action-btn"
                  title="Open slides file in Google Drive"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <span>Open in Drive</span>
                </a>
              </div>
            </div>

            <div className="slides-canvas-frame">
              <LocalPdfViewer
                dataUrl={currentSession.slidesCipher}
                pdfUrl={currentSession.slidesPdf}
                title={currentSession.slidesTitle}
                accent={accent}
              />
            </div>
          </div>
        )}

        {/* Session Topics & Resources Section */}
        <div className="workshop-details-section">
          {/* Topics Covered */}
          {currentSession.topics && currentSession.topics.length > 0 && (
            <div className="workshop-topics-box">
              <h5 className="box-title">
                <i className="fa-solid fa-list-check" style={{ color: accent }} />
                <span>Topics Covered in this Session</span>
              </h5>
              <div className="topics-grid">
                {currentSession.topics.map((topic, i) => (
                  <div key={i} className="topic-item">
                    <span className="topic-bullet" style={{ background: accent }} />
                    <span className="topic-text">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources & Materials Cards */}
          <div className="workshop-resources-grid">
            {/* Slides Resource */}
            <div className="resource-card">
              <div className="resource-icon" style={{ color: '#ff5c5c' }}>
                <i className="fa-solid fa-file-powerpoint" />
              </div>
              <div className="resource-body">
                <h6>Session Slides Deck</h6>
                <p>Complete visual presentation and diagrams used in the live lecture.</p>
                <div className="resource-links">
                  <button
                    className="resource-btn-link"
                    onClick={() => handleToggleView('slides')}
                    title="View slides inside the studio"
                  >
                    <i className="fa-solid fa-eye" /> View Slides
                  </button>
                  <a
                    href={currentSession.slidesPdf}
                    download={`${currentSession.title} Slides.pdf`}
                    className="resource-btn-link secondary"
                    title="Download slides PDF directly"
                  >
                    <i className="fa-solid fa-download" /> Download
                  </a>
                  <a
                    href={currentSession.slidesDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-btn-link secondary"
                    title="Open slides file in Google Drive"
                  >
                    Drive Link
                  </a>
                </div>
              </div>
            </div>

            {/* Notes Resource */}
            {currentSession.notesUrl && (
              <div className="resource-card">
                <div className="resource-icon" style={{ color: '#4285f4' }}>
                  <i className="fa-solid fa-file-lines" />
                </div>
                <div className="resource-body">
                  <h6>Meeting Notes & Gemini Summary</h6>
                  <p>Timestamped notes, discussed points, and AI-generated session overview.</p>
                  <div className="resource-links">
                    <a
                      href={currentSession.notesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-btn-link"
                    >
                      Open Google Doc <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Google Drive Folder Resource */}
            {workshop.folderDriveUrl && (
              <div className="resource-card">
                <div className="resource-icon" style={{ color: '#34a853' }}>
                  <i className="fa-brands fa-google-drive" />
                </div>
                <div className="resource-body">
                  <h6>Shared Workshop Folder</h6>
                  <p>Access all raw recordings, presentation files, and workshop assets.</p>
                  <div className="resource-links">
                    <a
                      href={workshop.folderDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-btn-link secondary"
                    >
                      Open Drive Folder <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
