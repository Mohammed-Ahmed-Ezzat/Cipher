import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { sfx } from '../../utils/soundEffects';
import { getAssetUrl } from '../../utils/urlHelper';

// Local worker file - 100% offline & subpath compatible
pdfjsLib.GlobalWorkerOptions.workerSrc = getAssetUrl('pdf.worker.min.js');

// Dedicated single page canvas component for perfect lifecycle & memory management
function PageCanvas({ pageNum, pdfDoc, scale }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let isCancelled = false;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // ignore
          }
        }

        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
        const viewport = page.getViewport({ scale: scale });

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const renderContext = {
          canvasContext: ctx,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null,
          viewport: viewport
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error(`Page ${pageNum} render error:`, err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [pdfDoc, pageNum, scale]);

  return <canvas ref={canvasRef} className="pdf-page-canvas" />;
}

export default function LocalPdfViewer({ dataUrl, pdfUrl, title, accent = '#20f0d0' }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' or 'single'

  const containerRef = useRef(null);

  // 1. Fetch raw binary data into memory to bypass IDM and browser PDF interceptors
  useEffect(() => {
    const targetUrl = dataUrl || pdfUrl;
    if (!targetUrl) return;

    let isMounted = true;
    let loadingTask = null;

    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setPageNum(1);

    const loadDocumentData = async () => {
      try {
        // Fetch raw bytes into memory using getAssetUrl
        const resolvedUrl = getAssetUrl(targetUrl);
        const response = await fetch(resolvedUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: HTTP ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        if (!isMounted) return;

        // Parse document from in-memory ArrayBuffer
        loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
          cMapPacked: true
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);

        // Calculate initial responsive fit scale
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth - 48;
          if (containerWidth > 200) {
            const initialScale = Math.min(Math.max(containerWidth / 740, 0.7), 1.6);
            setScale(parseFloat(initialScale.toFixed(2)));
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading roadmap document:', err);
        setError(err.message || 'Failed to load local document.');
        setLoading(false);
      }
    };

    loadDocumentData();

    return () => {
      isMounted = false;
      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [dataUrl, pdfUrl]);

  // Page Controls
  const handlePrevPage = () => {
    if (pageNum > 1) {
      sfx.playClick();
      setPageNum((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNum < numPages) {
      sfx.playClick();
      setPageNum((p) => p + 1);
    }
  };

  const handleZoomIn = () => {
    sfx.playClick();
    setScale((s) => Math.min(parseFloat((s + 0.15).toFixed(2)), 2.4));
  };

  const handleZoomOut = () => {
    sfx.playClick();
    setScale((s) => Math.max(parseFloat((s - 0.15).toFixed(2)), 0.5));
  };

  const handleZoomReset = () => {
    sfx.playClick();
    setScale(1.1);
  };

  const handleFitWidth = () => {
    sfx.playClick();
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48;
    if (containerWidth > 200) {
      const newScale = Math.min(Math.max(containerWidth / 740, 0.6), 2.0);
      setScale(parseFloat(newScale.toFixed(2)));
    }
  };

  const lastWheelTime = useRef(0);
  const handleSinglePageWheel = (e) => {
    if (viewMode !== 'single') return;
    const now = Date.now();
    if (now - lastWheelTime.current < 280) return;
    if (e.deltaY > 25) {
      if (pageNum < numPages) {
        lastWheelTime.current = now;
        handleNextPage();
      }
    } else if (e.deltaY < -25) {
      if (pageNum > 1) {
        lastWheelTime.current = now;
        handlePrevPage();
      }
    }
  };

  return (
    <div className="local-pdf-viewer">
      {/* Viewer Toolbar */}
      <div className="pdf-viewer-toolbar">
        <div className="toolbar-group">
          {viewMode === 'single' ? (
            <div className="toolbar-page-nav">
              <button
                className="toolbar-btn"
                onClick={handlePrevPage}
                disabled={pageNum <= 1}
                aria-label="Previous Page"
                title="Previous Page (Left Arrow)"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>

              <span className="toolbar-page-indicator">
                Page <b>{pageNum}</b> / {numPages || '-'}
              </span>

              <button
                className="toolbar-btn"
                onClick={handleNextPage}
                disabled={pageNum >= numPages}
                aria-label="Next Page"
                title="Next Page (Right Arrow)"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          ) : (
            <div className="toolbar-page-nav">
              <span className="toolbar-page-indicator">
                <i className="fa-solid fa-layer-group" />
                <span><b>{numPages}</b> Pages</span>
              </span>
            </div>
          )}

          {/* View Mode Switcher */}
          <div className="toolbar-mode-switch">
            <button
              className={`toolbar-btn mode-btn ${viewMode === 'scroll' ? 'active' : ''}`}
              onClick={() => {
                sfx.playClick();
                setViewMode('scroll');
              }}
              title="Continuous Vertical Scroll (All Pages)"
            >
              <i className="fa-solid fa-bars" />
              <span className="hide-on-mobile">Scroll</span>
            </button>
            <button
              className={`toolbar-btn mode-btn ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => {
                sfx.playClick();
                setViewMode('single');
              }}
              title="Single Page Presentation View"
            >
              <i className="fa-solid fa-file" />
              <span className="hide-on-mobile">Single</span>
            </button>
          </div>
        </div>

        {/* Zoom & Sizing Controls */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <i className="fa-solid fa-magnifying-glass-minus" />
          </button>

          <button
            className="toolbar-btn zoom-indicator-btn"
            onClick={handleZoomReset}
            title="Reset Zoom"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            className="toolbar-btn"
            onClick={handleZoomIn}
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <i className="fa-solid fa-magnifying-glass-plus" />
          </button>

          <button
            className="toolbar-btn fit-btn"
            onClick={handleFitWidth}
            title="Fit to Container Width"
          >
            <i className="fa-solid fa-arrows-left-right" />
            <span className="hide-on-mobile">Fit</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport Area */}
      <div
        className="pdf-canvas-viewport"
        ref={containerRef}
        data-lenis-prevent="true"
      >
        {loading && (
          <div className="pdf-loading-state">
            <div className="pdf-spinner" style={{ borderTopColor: accent }} />
            <span>Loading Document Locally...</span>
            <small className="pdf-loading-hint">
              Zero network latency · Offline Canvas Rendering
            </small>
          </div>
        )}

        {error && (
          <div className="pdf-error-state">
            <i className="fa-solid fa-triangle-exclamation" />
            <h4>Failed to render document</h4>
            <p>{error}</p>
            <a
              href={getAssetUrl(pdfUrl)}
              download={`${title || 'Roadmap'}.pdf`}
              className="btn-main"
            >
              <i className="fa-solid fa-download" /> Download Local File
            </a>
          </div>
        )}

        {!loading && !error && pdfDoc && (
          <div className={`pdf-pages-container mode-${viewMode}`}>
            {viewMode === 'single' ? (
              <div className="single-page-wrapper" onWheel={handleSinglePageWheel}>
                <PageCanvas
                  pageNum={pageNum}
                  pdfDoc={pdfDoc}
                  scale={scale}
                />
              </div>
            ) : (
              <div className="scroll-pages-list">
                {Array.from({ length: numPages }, (_, idx) => idx + 1).map((pNum) => (
                  <div key={pNum} className="scroll-page-item">
                    <div className="scroll-page-header">
                      <span>Page {pNum}</span>
                    </div>
                    <PageCanvas
                      pageNum={pNum}
                      pdfDoc={pdfDoc}
                      scale={scale}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
