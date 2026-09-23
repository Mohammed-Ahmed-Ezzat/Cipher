import React, { useState, useEffect, useRef } from 'react';
import LocalPdfViewer from './LocalPdfViewer';
import { sfx } from '../../utils/soundEffects';
import { getAssetUrl } from '../../utils/urlHelper';
import { useLanguage } from '../../context/LanguageContext';

export default function WorkshopStudio({
  workshop,
  accent = '#5be0ff',
  selectedDayIndex: controlledDayIndex,
  onSelectDayIndex
}) {
  const { t, isRTL } = useLanguage();
  const studioRootRef = useRef(null);
  const [internalDayIndex, setInternalDayIndex] = useState(0);
  const selectedDayIndex = controlledDayIndex !== undefined ? controlledDayIndex : internalDayIndex;
  const [activeView, setActiveView] = useState('video'); // 'video' | 'slides'
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  if (!workshop || !workshop.sessions || workshop.sessions.length === 0) {
    return (
      <div className="workshop-empty">
        <i className="fa-solid fa-graduation-cap" />
        <p>{isRTL ? 'محاضرات الورشة هتنزل هنا قريب جداً خليك متابع.' : 'Workshop sessions will be announced soon.'}</p>
      </div>
    );
  }

  const currentSession = workshop.sessions[selectedDayIndex] || workshop.sessions[0];

  const sessionTitlesAr = {
    'network-1': 'المحاضرة 01: أساسيات الشبكات ونموذج OSI',
    'network-2': 'المحاضرة 02: التوجيه والـ Routing والـ Switching',
    'backend-1': 'المحاضرة 01: معمارية الباك إند والـ APIs',
    'backend-2': 'المحاضرة 02: قواعد البيانات وتصميم السيرفرات',
    'frontend-1': 'المحاضرة 01: أساسيات الويب والـ HTML والـ CSS',
    'frontend-2': 'المحاضرة 02: هندسة الواجهات والـ UI التفاعلي',
    'flutter-1': 'المحاضرة 01: أساسيات فلاتر وبناء الودجت وتطبيق Profile Card',
    'flutter-2': 'المحاضرة 02: إدارة الحالة والـ State وتطبيق العداد Counter App'
  };

  const sessionKey = `${workshop.id}-${currentSession.day}`;
  const currentSessionTitle = isRTL ? (sessionTitlesAr[sessionKey] || currentSession.title) : currentSession.title;

  useEffect(() => {
    // Safety timer: Dismiss skeleton after 3.5s if onLoad is delayed
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [selectedDayIndex, reloadKey]);

  const handleSelectDay = (index) => {
    sfx.playClick();
    if (onSelectDayIndex) {
      onSelectDayIndex(index);
    } else {
      setInternalDayIndex(index);
    }
    setIsVideoLoading(true);
  };

  const handleToggleView = (view) => {
    sfx.playClick();
    setActiveView(view);
    if (studioRootRef.current) {
      studioRootRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="workshop-studio-root" ref={studioRootRef} data-lenis-prevent="true">
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
              <span className="day-label">{isRTL ? 'المحاضرة' : 'Session'}</span>
              {session.date && <span className="day-date">{session.date}</span>}
            </button>
          ))}
        </div>

        {/* View Switcher: Video vs Slides */}
        <div className="workshop-view-switch">
          <button
            className={`view-switch-btn ${activeView === 'video' ? 'active' : ''}`}
            onClick={() => handleToggleView('video')}
            title={isRTL ? 'شرح المحاضرة' : 'Watch recorded live session'}
          >
            <i className="fa-solid fa-play" />
            <span>{isRTL ? 'شرح المحاضرة' : t('modal', 'watchVideo', 'Watch Video')}</span>
          </button>
          <button
            className={`view-switch-btn ${activeView === 'slides' ? 'active' : ''}`}
            onClick={() => handleToggleView('slides')}
            title={isRTL ? 'عرض سلايدز المحاضرة' : 'View session presentation slides'}
          >
            <i className="fa-solid fa-file-powerpoint" />
            <span>{t('modal', 'sessionSlides', 'Session Slides')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workshop-main-viewport">
        {activeView === 'video' ? (
          <div className="workshop-video-pane">
            <div className="video-theater-wrapper" style={{ '--theater-accent': accent }}>
              <div className="video-ambient-glow" />

              {/* Desktop Player: Video embedded directly on computer */}
              <div className="stage-desktop-player">
                <div
                  className="stage-iframe-holder"
                  onPointerEnter={() => document.body.classList.add('hide-cursor-glow')}
                  onPointerLeave={() => document.body.classList.remove('hide-cursor-glow')}
                >
                  {isVideoLoading && (
                    <div className="video-skeleton">
                      <div className="video-spinner" />
                      <span>{isRTL ? 'بيحمّل الفيديو دلوقتي...' : 'Loading Video Stream...'}</span>
                    </div>
                  )}

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
              </div>

              {/* Mobile Player: Stream Card with Watch on Google Drive for phone */}
              <div className="stage-mobile-player">
                <div className="stage-drive-stream-card modal-stream-card">
                  <div className="stream-card-glow" />
                  <div className="stream-card-top">
                    <span className="stream-card-session">
                      {isRTL ? `المحاضرة 0${currentSession.day}` : `Day 0${currentSession.day}`}
                    </span>
                  </div>

                  <div className="stream-card-body">
                    <div className="stream-play-glow-wrap">
                      <div className="stream-play-pulse-ring" />
                      <div className="stream-play-icon-circle">
                        <i className="fa-solid fa-play" />
                      </div>
                    </div>
                    <h4 className="stream-card-title">{currentSessionTitle}</h4>
                    <p className="stream-card-subtitle">
                      {isRTL ? 'محاضرة لايف مسجلة مع مينتورز سايفر.' : 'Recorded live masterclass by Cipher mentors.'}
                    </p>
                  </div>

                  <a
                    href={currentSession.videoDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stream-card-action-btn"
                    onClick={() => sfx.playClick()}
                  >
                    <i className="fa-brands fa-google-drive" />
                    <span>{t('workshops', 'watchOnDrive', 'Watch on Google Drive')}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Slides Deck Mode rendered using Local Canvas Viewer */
          <div className="workshop-slides-pane">
            <div className="slides-header-bar">
              <div className="slides-title-info">
                <span className="session-badge">
                  <i className="fa-solid fa-file-pdf" /> {t('modal', 'sessionSlides', 'Presentation Slides')}
                </span>
                <h4>{currentSession.slidesTitle || `${currentSession.title} - Slides`}</h4>
              </div>
              <div className="slides-actions">
                <button
                  className="mini-btn workshop-action-btn"
                  onClick={() => handleToggleView('video')}
                  title={isRTL ? "الرجوع لتسجيل الفيديو" : "Return to video recording"}
                >
                  <i className="fa-solid fa-play" />
                  <span>{t('modal', 'backToVideo', 'Back to Video')}</span>
                </button>
                {currentSession.slidesPdf && (
                  <a
                    href={getAssetUrl(currentSession.slidesPdf)}
                    download={`${currentSession.slidesTitle || currentSession.title}.pdf`}
                    className="mini-btn workshop-action-btn highlight"
                    onClick={() => sfx.playClick()}
                    title={isRTL ? "تحميل ملف السلايدز بصيغة PDF" : "Download presentation slides PDF"}
                  >
                    <i className="fa-solid fa-download" />
                    <span>{isRTL ? 'تحميل PDF' : 'Download PDF'}</span>
                  </a>
                )}
                <a
                  href={currentSession.slidesDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mini-btn workshop-action-btn slides-drive-btn"
                  title={isRTL ? "فتح ملف السلايدز على درايف" : "Open slides file in Google Drive"}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <span>{t('modal', 'openInDrive', 'Open in Drive')}</span>
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


          {/* Resources & Materials Cards */}
          <div className="workshop-resources-grid">
            {/* Desktop Only: Watch on Google Drive */}
            <div className="resource-card desktop-only">
              <div className="resource-icon" style={{ color: '#20f0d0' }}>
                <i className="fa-brands fa-google-drive" />
              </div>
              <div className="resource-body">
                <h6>{t('workshops', 'watchOnDrive', 'Watch on Google Drive')}</h6>
                <p>{t('workshops', 'watchOnDriveSub', 'Open and stream recorded session in a new tab.')}</p>
                <div className="resource-links">
                  <a
                    href={currentSession.videoDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-btn-link"
                    onClick={() => sfx.playClick()}
                  >
                    <i className="fa-brands fa-google-drive" /> {t('workshops', 'watchOnDrive', 'Watch on Google Drive')}{' '}
                    <i className="fa-solid fa-arrow-up-right-from-square" />
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
                  <h6>{currentSession.notesTitle}</h6>
                  <p>{t('workshops', 'meetingNotesSub', 'Timestamped notes and AI summary on Google Docs.')}</p>
                  <div className="resource-links">
                    <a
                      href={currentSession.notesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-btn-link"
                    >
                      {isRTL ? 'فتح ملف Google Doc' : 'Open Google Doc'} <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Google Drive Folder Resource */}
            {(currentSession.folderDriveUrl || workshop.folderDriveUrl) && (
              <div className="resource-card">
                <div className="resource-icon" style={{ color: '#34a853' }}>
                  <i className="fa-brands fa-google-drive" />
                </div>
                <div className="resource-body">
                  <h6>
                    {currentSession.folderDriveUrl
                      ? (isRTL ? `فولدر سيشن 0${currentSession.day} على درايف` : `Session 0${currentSession.day} Drive Folder`)
                      : (isRTL ? 'فولدر الورشة المشترك على درايف' : 'Shared Workshop Folder')}
                  </h6>
                  <p>
                    {currentSession.folderDriveUrl
                      ? (isRTL ? `تصفح كل ملفات وفيديوهات وسلايدز سيشن 0${currentSession.day} على درايف.` : `Browse raw recordings, slides, and files for Session 0${currentSession.day}.`)
                      : t('workshops', 'driveFolderSub', 'Access all raw recordings, presentation files, and workshop assets.')}
                  </p>
                  <div className="resource-links">
                    <a
                      href={currentSession.folderDriveUrl || workshop.folderDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-btn-link secondary"
                    >
                      {isRTL ? 'فتح فولدر درايف' : 'Open Drive Folder'} <i className="fa-solid fa-arrow-up-right-from-square" />
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
