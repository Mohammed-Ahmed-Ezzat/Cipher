import React, { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let active = false;
    let animationFrame;

    const isVideoOrIframe = (target) => {
      if (!target) return false;
      if (target.tagName === 'IFRAME') return true;
      if (typeof target.closest === 'function') {
        return !!target.closest(
          'iframe, .stage-iframe, .stage-iframe-holder, .stage-desktop-player, .video-theater-wrapper, .stage-player-box'
        );
      }
      return false;
    };

    const hideCursor = () => {
      if (!active) return;
      active = false;
      glow.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const handlePointerMove = (e) => {
      // Hide when pointer is on or near the scrollbar (right edge) or viewport edges
      const docWidth = document.documentElement.clientWidth;
      if (e.clientX >= docWidth - 4 || e.clientX <= 2 || e.clientY <= 2 || e.clientY >= window.innerHeight - 2) {
        hideCursor();
        return;
      }

      // Hide when pointer is inside video/iframe players
      if (isVideoOrIframe(e.target)) {
        hideCursor();
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      if (!active) {
        active = true;
        glow.style.opacity = '0.9';
        dot.style.opacity = '1';
      }
    };

    const handleMouseOut = (e) => {
      if (!e.relatedTarget || isVideoOrIframe(e.relatedTarget)) {
        hideCursor();
      }
    };

    const handleMouseOver = (e) => {
      if (isVideoOrIframe(e.target)) {
        hideCursor();
      }
    };

    const handleScroll = () => {
      const docWidth = document.documentElement.clientWidth;
      if (targetX >= docWidth - 12) {
        hideCursor();
      }
    };

    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      animationFrame = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.documentElement.addEventListener('mouseleave', hideCursor);
    window.addEventListener('blur', hideCursor);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) hideCursor();
    });

    animationFrame = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.documentElement.removeEventListener('mouseleave', hideCursor);
      window.removeEventListener('blur', hideCursor);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={dotRef} className="cursor-glow-dot" aria-hidden="true" />
    </>
  );
}
