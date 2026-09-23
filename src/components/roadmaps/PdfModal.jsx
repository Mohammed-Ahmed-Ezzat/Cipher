import React, { useEffect, useState } from 'react';
import LocalPdfViewer from './LocalPdfViewer';
import WorkshopStudio from './WorkshopStudio';
import { workshopsData } from '../../data/workshopsData';
import { sfx } from '../../utils/soundEffects';
import { getAssetUrl } from '../../utils/urlHelper';
import { useLanguage } from '../../context/LanguageContext';

export default function PdfModal({ roadmap, initialTab = 'roadmap', onClose }) {
  const { t, isRTL } = useLanguage();
  const workshopInfo = roadmap ? workshopsData[roadmap.id] : null;
  const hasWorkshop = Boolean(workshopInfo);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [workshopDayIndex, setWorkshopDayIndex] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, roadmap]);

  useEffect(() => {
    if (!roadmap) return;

    // Lock background page scroll to prevent background scrolling while reading PDF
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Push browser history state for seamless Android/iOS back button closing
    window.history.pushState({ pdfModal: true }, '', window.location.href);

    const handlePopState = () => {
      sfx.playClick();
      onClose();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sfx.playClick();
        if (window.history.state?.pdfModal) {
          window.history.back();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [roadmap, onClose]);

  if (!roadmap) return null;

  const handleClose = () => {
    sfx.playClick();
    if (window.history.state?.pdfModal) {
      window.history.back();
    } else {
      onClose();
    }
  };

  const itemTranslation = t('roadmaps', 'items', {})[roadmap.id];
  const displayTitle = (isRTL && itemTranslation?.title) ? itemTranslation.title : roadmap.title;
  const displayDesc = (isRTL && itemTranslation?.desc) ? itemTranslation.desc : roadmap.desc;

  const localPdfUrl = roadmap.pdf || roadmap.download;
  const localDataUrl = roadmap.dataUrl || localPdfUrl;

  return (
    <div
      className="pdf-modal-backdrop show"
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="pdf-modal-dialog" data-lenis-prevent="true">
        <div className="pdf-modal-content" data-lenis-prevent="true">
          {/* Header */}
          <div className="pdf-modal-header">
            <div className="pdf-modal-header-left">
              <div
                className="modal-icon"
                style={{
                  color: roadmap.accent,
                  borderColor: `color-mix(in srgb, ${roadmap.accent} 30%, transparent)`
                }}
              >
                <i className={`fa-solid ${activeTab === 'workshop' ? 'fa-graduation-cap' : roadmap.icon}`} />
              </div>
              <div className="modal-title-wrap">
                <div className="modal-badge-row">
                  <span className="modal-category-tag">{roadmap.category || 'Roadmap'}</span>
                  {roadmap.level && <span className="modal-level-tag">{roadmap.level}</span>}
                  {hasWorkshop && (
                    <span className="modal-workshop-chip">
                      <i className="fa-solid fa-sparkles" /> {t('modal', 'recordedChip', 'Recorded Workshop')}
                    </span>
                  )}
                </div>
                <h3 className="modal-title" id="modalTitle">
                  {displayTitle}
                </h3>
                <p className="modal-subtitle">
                  {activeTab === 'workshop'
                    ? (isRTL
                        ? (workshopInfo.descriptionAr || 'شاهد المحاضرات المسجلة لايف، وتصفح السلايدز والملاحظات.')
                        : (workshopInfo.description || 'Watch recorded live workshop sessions, browse presentation slides, and access notes.'))
                    : displayDesc}
                </p>
              </div>
            </div>

            <div className="modal-header-actions">
              {activeTab === 'roadmap' && (
                <a
                  className="mini-btn download-btn"
                  href={getAssetUrl(localPdfUrl)}
                  download={`${roadmap.title} Roadmap.pdf`}
                  title="Download local PDF directly to your device"
                >
                  <i className="fa-solid fa-download" />
                  <span>{t('modal', 'downloadPdf', 'Download')}</span>
                </a>
              )}

              {activeTab === 'roadmap' && (
                <a
                  className="mini-btn"
                  href={roadmap.driveUrl || getAssetUrl(localPdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open roadmap file in a new browser tab (Google Drive)"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <span>{t('modal', 'openInTab', 'Open in Tab')}</span>
                </a>
              )}

              <button
                className="mini-btn pdf-close-btn"
                onClick={handleClose}
                aria-label="Close viewer"
                title="Close Viewer (Esc)"
              >
                <i className="fa-solid fa-xmark" />
                <span>{t('modal', 'close', 'Close')}</span>
              </button>
            </div>
          </div>

          {/* Modal Navigation Tabs (Shown when workshop is available) */}
          {hasWorkshop && (
            <div className="modal-nav-tabs">
              <button
                className={`modal-tab-pill ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => {
                  sfx.playClick();
                  setActiveTab('roadmap');
                }}
              >
                <i className="fa-solid fa-route" />
                <span>{t('modal', 'roadmapPath', 'Roadmap Path')}</span>
              </button>
              <button
                className={`modal-tab-pill workshop-pill ${activeTab === 'workshop' ? 'active' : ''}`}
                onClick={() => {
                  sfx.playClick();
                  setActiveTab('workshop');
                }}
                style={{ '--pill-accent': roadmap.accent }}
              >
                <i className="fa-solid fa-graduation-cap" />
                <span>{t('modal', 'workshopStudio', 'Workshop Studio')}</span>
                <span className="live-dot-tag">
                  {workshopInfo?.sessions?.length === 1
                    ? (isRTL ? 'محاضرة لايف مسجلة' : '1 Live Session')
                    : (isRTL ? `${workshopInfo?.sessions?.length || 2} محاضرات مسجلة` : `${workshopInfo?.sessions?.length || 2} Sessions`)}
                </span>
              </button>
            </div>
          )}

          {/* Modal Body: Either Local PDF Roadmap or Workshop Studio */}
          <div className="pdf-frame-wrap">
            {activeTab === 'roadmap' ? (
              <LocalPdfViewer
                dataUrl={localDataUrl}
                pdfUrl={localPdfUrl}
                title={displayTitle}
                accent={roadmap.accent}
              />
            ) : (
              <WorkshopStudio
                workshop={workshopInfo}
                accent={roadmap.accent}
                selectedDayIndex={workshopDayIndex}
                onSelectDayIndex={setWorkshopDayIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
