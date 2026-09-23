import React, { useState, useEffect } from 'react';
import { workshopsData } from '../../data/workshopsData';
import LocalPdfViewer from '../roadmaps/LocalPdfViewer';
import { sfx } from '../../utils/soundEffects';
import { getAssetUrl } from '../../utils/urlHelper';
import { useLanguage } from '../../context/LanguageContext';

export default function WorkshopsSection() {
  const { t, isRTL } = useLanguage();
  const [selectedTrack, setSelectedTrack] = useState('network'); // 'network' | 'backend' | 'frontend'
  const workshop = workshopsData[selectedTrack] || workshopsData.network;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeView, setActiveView] = useState('video'); // 'video' | 'slides'
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

  if (!workshop) return null;

  const currentSession = workshop.sessions[selectedDayIndex] || workshop.sessions[0];

  useEffect(() => {
    // Safety timer: Dismiss skeleton after 3.5s in case onLoad is delayed or blocked
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [selectedTrack, selectedDayIndex, reloadKey]);

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

  const trackIcon = selectedTrack === 'network'
    ? 'fa-solid fa-network-wired'
    : selectedTrack === 'backend'
    ? 'fa-solid fa-server'
    : 'fa-solid fa-laptop-code';

  const trackTitlesAr = {
    network: 'ورشة شبكات الحاسب والـ OSI',
    backend: 'ورشة تطوير الباك إند والـ APIs',
    frontend: 'ورشة تطوير الفرونت إند والـ UI'
  };

  const sessionTitlesAr = {
    'network-1': 'المحاضرة 01: أساسيات الشبكات ونموذج OSI',
    'network-2': 'المحاضرة 02: التوجيه والـ Routing والـ Switching',
    'backend-1': 'المحاضرة 01: معمارية الباك إند والـ APIs',
    'backend-2': 'المحاضرة 02: قواعد البيانات وتصميم السيرفرات',
    'frontend-1': 'المحاضرة 01: أساسيات الويب والـ HTML والـ CSS',
    'frontend-2': 'المحاضرة 02: هندسة الواجهات والـ UI التفاعلي'
  };

  const sessionKey = `${selectedTrack}-${currentSession.day}`;
  const currentSessionTitle = isRTL ? (sessionTitlesAr[sessionKey] || currentSession.title) : currentSession.title;
  const currentTrackTitle = isRTL ? (trackTitlesAr[selectedTrack] || workshop.trackTitle) : workshop.trackTitle;

  return (
    <section id="workshops">
      <div className="container-xl">
        {/* Section Header */}
        <div className="workshops-header-wrap reveal-on-scroll">
          <div className="section-kicker">{t('workshops', 'kicker', '02 / Hands-On Workshops')}</div>
          <h2 className="section-title">
            {t('workshops', 'title', 'Recorded')}{' '}
            <span className="gradient">{t('workshops', 'titleGradient', 'Workshops.')}</span>
          </h2>
          <p className="section-desc">
            {t('workshops', 'desc', 'Missed the live lectures? Watch the complete recorded masterclasses, study the presentation slides directly, and access timestamped meeting notes prepared by Cipher mentors.')}
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
            const title = isRTL ? (trackTitlesAr[key] || item.trackTitle) : item.trackTitle;
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
                  <span className="track-choice-title">{title}</span>
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
                <i className={trackIcon} /> {currentTrackTitle}
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
                  <span>{isRTL ? `المحاضرة 0${session.day}` : `Session ${session.day}`}</span>
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
                <span>{t('workshops', 'watchVideo', 'Watch Video')}</span>
              </button>
              <button
                className={`stage-view-btn ${activeView === 'slides' ? 'active' : ''}`}
                onClick={() => handleToggleView('slides')}
                title="Browse session slides deck"
              >
                <i className="fa-solid fa-file-powerpoint" />
                <span>{t('workshops', 'sessionSlides', 'Session Slides')}</span>
              </button>
            </div>
          </div>

          {/* Main Stage Viewport */}
          {activeView === 'video' ? (
            !isTheaterOpen ? (
              /* Creative Cinema Teaser State (No abrupt black box on scroll!) */
              <div className="workshop-cinema-teaser">
                <div className="teaser-ambient-glow" />
                <div className="teaser-grid-backdrop" />

                <div className="teaser-content">
                  <div className="teaser-badge-row">
                    <span className="teaser-live-pill">
                      <span className="live-pulse-dot" />
                      {isRTL ? 'تسجيل ورشة عمل لايف' : 'Live Masterclass Recording'}
                    </span>
                    <span className="teaser-session-chip">
                      {isRTL ? `المحاضرة 0${currentSession.day}` : `Session 0${currentSession.day}`}
                    </span>
                  </div>

                  <h3 className="teaser-title">{currentSessionTitle}</h3>
                  <p className="teaser-desc">
                    {isRTL
                      ? 'محاضرة عملية متسجلة لايف مع شباب ومينتورز سايفر.. شوف شرح المحاضرة كامل بالفيديو والسلايدز وملاحظات الجلسة.'
                      : 'Hands-on masterclass recorded live by Cipher mentors. Watch the full lecture, study presentation slides, and review notes.'}
                  </p>

                  <div className="teaser-features-row">
                    <span className="teaser-feature-tag">
                      <i className="fa-solid fa-circle-play" /> {isRTL ? 'محاضرة كاملة' : 'Full Session'}
                    </span>
                    <span className="teaser-feature-tag">
                      <i className="fa-solid fa-file-powerpoint" /> {isRTL ? 'سلايدز الشرح' : 'Interactive Slides'}
                    </span>
                    <span className="teaser-feature-tag">
                      <i className="fa-solid fa-file-lines" /> {isRTL ? 'تلخيص وملاحظات' : 'Gemini AI Notes'}
                    </span>
                  </div>

                  <div className="teaser-actions">
                    {/* Desktop Launch Cinema Button (Shown ONLY on Desktop) */}
                    <button
                      type="button"
                      className="teaser-launch-btn teaser-desktop-btn"
                      onClick={() => {
                        sfx.playActivate();
                        setIsTheaterOpen(true);
                      }}
                      title={isRTL ? 'شرح المحاضرة' : 'Watch Workshop Session'}
                    >
                      <i className="fa-solid fa-play" />
                      <span>{t('workshops', 'launchTheaterBtn', 'Launch Workshop Cinema')}</span>
                      <i className="fa-solid fa-arrow-right btn-arrow" />
                    </button>

                    {/* Mobile Direct Stream Button (Shown ONLY on Mobile) */}
                    <a
                      href={currentSession.videoDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="teaser-launch-btn teaser-mobile-btn"
                      onClick={() => sfx.playClick()}
                    >
                      <i className="fa-brands fa-google-drive" />
                      <span>{t('workshops', 'watchOnDrive', 'Watch on Google Drive')}</span>
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Active Video Theater Mode (when user clicks Launch Cinema) */
              <div className="stage-player-box theater-active">
                <div className="stage-ambient-glow" />

                <div className="stage-theater-controls-bar">
                  <span className="theater-status-tag">
                    <span className="live-pulse-dot" /> {isRTL ? 'شرح المحاضرة شغال' : 'Cinema Theater Active'}
                  </span>
                  <button
                    type="button"
                    className="theater-collapse-btn"
                    onClick={() => {
                      sfx.playClick();
                      setIsTheaterOpen(false);
                    }}
                    title={isRTL ? 'قفل شرح المحاضرة' : 'Collapse Workshop Theater'}
                  >
                    <i className="fa-solid fa-compress" />
                    <span>{t('workshops', 'collapseTheaterBtn', 'Collapse Cinema')}</span>
                  </button>
                </div>

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
                        <span>{isRTL ? 'جاري الاتصال بالبث...' : 'Loading Video Stream...'}</span>
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

                {/* Mobile Player */}
                <div className="stage-mobile-player">
                  <div className="stage-drive-stream-card">
                    <div className="stream-card-glow" />
                    <div className="stream-card-top">
                      <span className="stream-card-session">
                        {isRTL ? `المحاضرة 0${currentSession.day}` : `Session 0${currentSession.day}`}
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
                        {isRTL ? 'محاضرة لايف مسجلة من مينتورز سايفر.' : 'Recorded live masterclass by Cipher mentors.'}
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
            )
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


          {/* Stage Bottom Grid: Topics Covered & Material Links */}
          <div className="stage-bottom-grid">
            {/* Topics Covered (Desktop only, hidden on mobile) */}
            <div className="stage-topics-panel desktop-only">
              <h4 className="stage-panel-heading">
                <i className="fa-solid fa-list-check" />
                <span>
                  {isRTL
                    ? `المحاور اللي اتشرحت في المحاضرة 0${currentSession.day}`
                    : `Topics Covered in Day ${currentSession.day}`}
                </span>
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
              {/* Workshop Presentation Slides PDF Download (Desktop only) */}
              {currentSession.slidesPdf && (
                <a
                  href={getAssetUrl(currentSession.slidesPdf)}
                  download={`${currentSession.slidesTitle || currentSession.title}.pdf`}
                  className="stage-resource-item stage-download-card desktop-only"
                  onClick={() => sfx.playClick()}
                  title={isRTL ? "تحميل ملف سلايدز الورشة PDF مباشرة على جهازك" : "Download session presentation slides PDF"}
                >
                  <div className="stage-resource-icon" style={{ color: '#ff5c5c' }}>
                    <i className="fa-solid fa-file-pdf" />
                  </div>
                  <div className="stage-resource-info">
                    <h6>{isRTL ? 'تحميل سلايدز الورشة (PDF)' : 'Download Workshop Slides (PDF)'}</h6>
                    <p>{isRTL ? `تحميل ملف العرض التقديمي كامل لـ ${currentSessionTitle} للمذاكرة أوفلاين.` : `Download full presentation slides deck for ${currentSession.title}.`}</p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-download" />
                  </div>
                </a>
              )}

              {/* Desktop Only: Replace button with Watch on Google Drive in a new tab */}
              <a
                href={currentSession.videoDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="stage-resource-item desktop-only"
                onClick={() => sfx.playClick()}
                title={isRTL ? "افتح وشغّل المحاضرة في تاب منفصل على درايف" : "Open video stream in new tab on Google Drive"}
              >
                <div className="stage-resource-icon" style={{ color: '#20f0d0' }}>
                  <i className="fa-brands fa-google-drive" />
                </div>
                <div className="stage-resource-info">
                  <h6>{t('workshops', 'watchOnDrive', 'Watch on Google Drive')}</h6>
                  <p>{t('workshops', 'watchOnDriveSub', 'Open and stream recorded session in a new tab.')}</p>
                </div>
                <div className="stage-resource-action">
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </div>
              </a>

              {/* Mobile Only: Download Workshop Slides PDF */}
              {currentSession.slidesPdf ? (
                <a
                  href={getAssetUrl(currentSession.slidesPdf)}
                  download={`${currentSession.slidesTitle || currentSession.title}.pdf`}
                  className="stage-resource-item mobile-only"
                  onClick={() => sfx.playClick()}
                  title={isRTL ? "تحميل ملف سلايدز الورشة PDF مباشرة على هاتفك" : "Download session presentation slides PDF"}
                >
                  <div className="stage-resource-icon" style={{ color: '#ff5c5c' }}>
                    <i className="fa-solid fa-file-pdf" />
                  </div>
                  <div className="stage-resource-info">
                    <h6>{currentSession.slidesTitle || (isRTL ? 'تحميل سلايدز الورشة (PDF)' : 'Workshop Slides (PDF)')}</h6>
                    <p>{isRTL ? 'اضغط هنا لتحميل سلايدز المحاضرة بصيغة PDF.' : 'Click to download presentation slides (PDF).'}</p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-download" />
                  </div>
                </a>
              ) : currentSession.slidesDriveUrl ? (
                <a
                  href={currentSession.slidesDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stage-resource-item mobile-only"
                  onClick={() => sfx.playClick()}
                  title={isRTL ? "فتح سلايدز الورشة على درايف" : "Open session slides on Google Drive"}
                >
                  <div className="stage-resource-icon" style={{ color: '#ff5c5c' }}>
                    <i className="fa-solid fa-file-powerpoint" />
                  </div>
                  <div className="stage-resource-info">
                    <h6>{currentSession.slidesTitle}</h6>
                    <p>{isRTL ? 'فتح السلايدز على Google Drive.' : 'Open presentation slides on Google Drive.'}</p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </div>
                </a>
              ) : null}

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
                    <p>{t('workshops', 'meetingNotesSub', 'Timestamped notes and AI summary on Google Docs.')}</p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </div>
                </a>
              )}

              {(currentSession.folderDriveUrl || workshop.folderDriveUrl) && (
                <a
                  href={currentSession.folderDriveUrl || workshop.folderDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stage-resource-item"
                >
                  <div className="stage-resource-icon" style={{ color: '#34a853' }}>
                    <i className="fa-brands fa-google-drive" />
                  </div>
                  <div className="stage-resource-info">
                    <h6>
                      {currentSession.folderDriveUrl
                        ? (isRTL ? `فولدر سيشن 0${currentSession.day} على درايف` : `Session 0${currentSession.day} Google Drive Folder`)
                        : (isRTL ? 'فولدر الورشة الكامل على درايف' : 'Complete Google Drive Folder')}
                    </h6>
                    <p>
                      {currentSession.folderDriveUrl
                        ? (isRTL ? `تصفح كل ملفات وفيديوهات وسلايدز سيشن 0${currentSession.day} على درايف.` : `Browse raw recordings, slides, and files for Session 0${currentSession.day}.`)
                        : t('workshops', 'driveFolderSub', 'Browse all raw files, recordings, and workshop assets.')}
                    </p>
                  </div>
                  <div className="stage-resource-action">
                    <i className="fa-solid fa-folder-open" />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
