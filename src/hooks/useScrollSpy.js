import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || 'home');
  const [isScrolled, setIsScrolled] = useState(false);

  const sectionKey = Array.isArray(sectionIds) ? sectionIds.join(',') : '';

  useEffect(() => {
    // 1. Throttled scroll indicator for navbar background
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setIsScrolled(window.scrollY > 24);

    // 2. High-performance IntersectionObserver for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0
      }
    );

    const ids = sectionKey.split(',').filter(Boolean);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [sectionKey]);

  return { activeSection, isScrolled };
}
