import React, { useState, useEffect } from 'react';
import Preloader from './components/common/Preloader';
import CursorGlow from './components/common/CursorGlow';
import ScrollProgress from './components/common/ScrollProgress';
import BackToTop from './components/common/BackToTop';
import Toast from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/hero/Hero';
import HeroParticles from './components/hero/HeroParticles';
import RoadmapsSection from './components/roadmaps/RoadmapsSection';
import WorkshopsSection from './components/sections/WorkshopsSection';
import PdfModal from './components/roadmaps/PdfModal';
import AboutSection from './components/sections/AboutSection';
import WhatWeDoSection from './components/sections/WhatWeDoSection';
import NextSection from './components/sections/NextSection';
import FaqSection from './components/sections/FaqSection';
import ConnectSection from './components/sections/ConnectSection';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useScrollReveal } from './hooks/useScrollReveal';
import Lenis from 'lenis';
import { sfx } from './utils/soundEffects';

const SECTIONS = ['home', 'roadmaps', 'workshops', 'intro', 'what-we-do', 'faq', 'connect'];

export default function App() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { activeSection, isScrolled } = useScrollSpy(SECTIONS);

  // Activate high-framerate scroll reveal observer
  useScrollReveal();

  // Initialize Lenis buttery-smooth momentum scrolling (120Hz high-framerate feel)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      infinite: false
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);



  const handleCopyEmail = () => {
    sfx.playActivate();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <HeroParticles />
      <CursorGlow />

      <Navbar activeSection={activeSection} isScrolled={isScrolled} />

      <main>
        <Hero />
        <RoadmapsSection onOpenRoadmap={(roadmap) => setSelectedRoadmap(roadmap)} />
        <WorkshopsSection />
        <AboutSection />
        <WhatWeDoSection />
        <NextSection />
        <FaqSection />
        <ConnectSection onCopyEmail={handleCopyEmail} />
      </main>

      <Footer />
      <BackToTop />

      {selectedRoadmap && (
        <PdfModal
          roadmap={selectedRoadmap}
          onClose={() => setSelectedRoadmap(null)}
        />
      )}

      <Toast message="Email copied to clipboard!" show={showToast} />
    </>
  );
}
