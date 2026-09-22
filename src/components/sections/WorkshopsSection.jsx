import React, { useState, useEffect } from 'react';
import { workshopsData } from '../../data/workshopsData';
import LocalPdfViewer from '../roadmaps/LocalPdfViewer';
import { sfx } from '../../utils/soundEffects';

export default function WorkshopsSection() {
  const [selectedTrack, setSelectedTrack] = useState('network'); // 'network' | 'backend' | 'frontend'
  const workshop = workshopsData[selectedTrack] || workshopsData.network;
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

  if (!workshop) return null;

  const currentSession = workshop.sessions[selectedDayIndex] || workshop.sessions[0];

  useEffect(() => {
    // Safety timer: Dismiss skeleton after 3.5s in case onLoad is delayed or blocked by Safari ITP
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [selectedTrack, selectedDayIndex, reloadKey]);

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

  const handleSelectTrack = (trackKey) => {
    sfx.playClick();
    setSelectedTrack(trackKey);
    setSelectedDayIndex(0);
    setIsVideoLoading(true);
  };

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

  const trackIcon = selectedTrack === 'network'
    ? 'fa-solid fa-network-wired'
    : selectedTrack === 'backend'
    ? 'fa-solid fa-server'
    : 'fa-solid fa-laptop-code';

  return (
    <section id="workshops">
      <div className="container-xl">
        {/* Section Header */}
        <div className="workshops-header-wrap reveal-on-scroll">
          <div className="section-kicker">02 / Hands-On Workshops</div>
          <h2 className="section-title">
            Recorded <span className="gradient">Live Sessions.</span>
          </h2>
          <p className="section-desc">
            Missed the live lectures? Watch the complete recorded masterclasses, study the
            presentation slides directly, and access timestamped meeting notes prepared by Cipher mentors.
          </p>
        </div>

        {/* Track Selection Switcher */}
        <div className="workshop-track-selector-bar reveal-on-scroll">
          {Object.entries(workshopsData).map(([key, item]) => {
            const isSelected = selectedTrack === key;
            const icon = key === 'network'
              ? 'fa-solid fa-network-wired'
              : key === 'backend'
              ? 'fa-solid fa-server'
              : 'fa-solid fa-laptop-code';
            return (
              <button
                key={key}
                type="button"
                className={`workshop-track-choice-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectTrack(key)}
              >
                <div className="track-choice-icon">
                  <i className={icon} />
                </div>
                <div className="track-choice-text">
                  <span className="track-choice-title">{item.trackTitle}</span>
                  <span className="track-choice-badge">{item.badge}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workshop Stage Card */}
        <div className="workshop-stage-card reveal-on-scroll">
          {/* Stage Top Bar */}
          <div className="workshop-stage-topbar">
            <div className="workshop-track-badge-group">
              <span className="workshop-track-pill">
                <i className={trackIcon} /> {workshop.trackTitle}
              </span>
              <span className="workshop-live-chip">
                <span className="live-pulse-dot" /> {workshop.badge || `${workshop.sessions.length} Recorded Sessions`}
              </span>
            </div>

            {/* Day Selector (Day 1 vs Day 2) */}
            <div className="stage-day-switcher">
              {workshop.sessions.map((session, idx) => (
                <button
                  key={session.day}
                  className={`stage-day-btn ${selectedDayIndex === idx ? 'active' : ''}`}
                  onClick={() => handleSelectDay(idx)}
                >
                  <b>0{session.day}</b>
                  <span>Session {session.day}</span>
                </button>
              ))}
            </div>

            {/* View Switcher: Video vs Slides */}
            <div className="stage-view-switcher">
              <button
                className={`stage-view-btn ${activeView === 'video' ? 'active' : ''}`}
                onClick={() => handleToggleView('video')}
                title="Stream session video recording"
              >
                <i className="fa-solid fa-play" />
                <span>Watch Video</span>
              </button>
              <button
                className={`stage-view-btn ${activeView === 'slides' ? 'active' : ''}`}
                onClick={() => handleToggleView('slides')}
                title="Browse session slides deck"
              >
                <i className="fa-solid fa-file-powerpoint" />
                <span>Session Slides</span>
              </button>
            </div>
          </div>

          {/* Main Stage Viewport */}
          {activeView === 'video' ? (
            /* Video Theater Mode */
            <div className="stage-player-box">
              <div className="stage-ambient-glow" />

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
                <div className="stage-iframe-holder direct-mode">
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
                      <i className={trackIcon} /> {workshop.trackTitle}
                    </span>
                    <span className="direct-session-tag">
                      Session {currentSession.day} • {currentSession.date}
                    </span>
                  </div>
                </div>
              ) : (
                /* Embedded Iframe Player */
                <div className="stage-iframe-holder">
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
                    className="stage-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="eager"
                    onLoad={() => setIsVideoLoading(false)}
                  />
                </div>
              )}

              {/* Player Bottom Helper Note */}
              <div className="stage-player-helper">
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
          ) : (
            /* Slides Deck Mode via Local Canvas Viewer */
            <div className="stage-slides-box">
              <LocalPdfViewer
                dataUrl={currentSession.slidesCipher}
                pdfUrl={currentSession.slidesPdf}
                title={currentSession.slidesTitle}
                accent="#5be0ff"
              />
            </div>
          )}

          {/* Session Meta & Action Bar */}
          <div className="stage-meta-row">
            <div className="stage-meta-info">
              <h3 className="stage-session-title">{currentSession.title}</h3>
              <div className="stage-session-meta">
                <span>
                  <i className="fa-regular fa-calendar" /> {currentSession.date}
                </span>
                <span>•</span>
                <span>
                  <i className="fa-solid fa-chalkboard-user" /> {workshop.instructor}
                </span>
              </div>
            </div>

            <div className="stage-actions-cluster">
              <a
                href={currentSession.videoDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="stage-action-btn primary drive-highlight"
                title="Open video directly in Google Drive app"
              >
                <i className="fa-brands fa-google-drive" />
                <span>Open in Drive</span>
              </a>

              <a
                href={currentSession.slidesPdf}
                download={`${currentSession.title} Slides.pdf`}
                className="stage-action-btn"
                title="Download presentation slides"
              >
                <i className="fa-solid fa-download" />
                <span>Download Slides</span>
              </a>

              {currentSession.notesUrl && (
                <a
                  href={currentSession.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stage-action-btn"
                  title="View Gemini AI meeting notes"
                >
                  <i className="fa-solid fa-file-lines" />
                  <span>Meeting Notes</span>
                </a>
              )}
            </div>
          </div>

          {/* Stage Bottom Grid: Topics Covered & Material Links */}
          <div className="stage-bottom-grid">
            {/* Topics Covered */}
            <div className="stage-topics-panel">
              <h4 className="stage-panel-heading">
                <i className="fa-solid fa-list-check" />
                <span>Topics Covered in Day {currentSession.day}</span>
              </h4>
              <div className="stage-topics-list">
                {currentSession.topics.map((topic, i) => (
                  <div key={i} className="stage-topic-badge">
                    <span />
                    <div>{topic}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Resources List */}
            <div className="stage-resources-panel">
              <div
                className="stage-resource-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleToggleView('slides')}
              >
                <div className="stage-resource-icon" style={{ color: '#ff5c5c' }}>
                  <i className="fa-solid fa-file-powerpoint" />
                </div>
                <div className="stage-resource-info">
                  <h6>{currentSession.slidesTitle}</h6>
                  <p>Click to open the interactive canvas slides deck viewer.</p>
                </div>
                <div className="stage-resource-action">
                  <i className="fa-solid fa-eye" />
                </div>
              </div>

              {currentSession.notesUrl && (
                <a
                  href={currentSession.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stage-resource-item"
                >
                  <div className="stage-resource-icon" style={{ color: '#4285f4' }}>
                    <i className="fa-solid fa-file-lines" />
                  </div>
                  <div className="stage-resource-info">
                    <h6>{currentSession.notesTitle}</h6>
                    <p>Timestamped notes and AI summary on Google Docs.</p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </div>
                </a>
              )}

              {workshop.folderDriveUrl && (
                <a
                  href={workshop.folderDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stage-resource-item"
                >
                  <div className="stage-resource-icon" style={{ color: '#34a853' }}>
                    <i className="fa-brands fa-google-drive" />
                  </div>
                  <div className="stage-resource-info">
                    <h6>Complete Google Drive Folder</h6>
                    <p>Browse all raw files, recordings, and workshop assets.</p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-folder-open" />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Workshops Banner */}
        <div className="upcoming-workshops-strip reveal-on-scroll">
          <div className="upcoming-left">
            <span className="upcoming-badge">
              <i className="fa-solid fa-clock" /> In Progress
            </span>
            <span>More recorded tracks will be unlocked as workshops are completed:</span>
          </div>
          <div className="upcoming-tracks-list">
            <span className="upcoming-pill">Problem Solving Live Sessions</span>
            <span className="upcoming-pill">Flutter Mobile Masterclass</span>
            <span className="upcoming-pill">DevOps Cloud Automation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
