import React, { useState } from 'react';
import { siteConfig } from '../../data/siteConfig';
import { sfx } from '../../utils/soundEffects';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar({ activeSection, isScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const toggleMobileMenu = () => {
    sfx.playClick();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    sfx.playClick();
    closeMobileMenu();
  };

  const navLinkLabels = {
    '#home': t('nav', 'home', 'Home'),
    '#roadmaps': t('nav', 'roadmaps', 'Roadmaps'),
    '#workshops': t('nav', 'workshops', 'Workshops'),
    '#about': t('nav', 'about', 'About'),
    '#what-we-do': t('nav', 'whatWeDo', 'What We Do'),
    '#faq': t('nav', 'faq', 'FAQ'),
    '#connect': t('nav', 'connect', 'Connect')
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="nav">
        <div className="container-xl nav-container">
          <a href="#home" className="brand" onClick={handleNavLinkClick}>
            <span className="brand-mark">
              <i className="fa-solid fa-terminal" />
            </span>
            <span className="brand-word">
              {siteConfig.brand.name}<i>.</i>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            {siteConfig.navLinks.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;
              const label = navLinkLabels[link.href] || link.label;
              return (
                <a
                  key={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  href={link.href}
                  onClick={() => sfx.playClick()}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Desktop Action Cluster: Language Switcher & CTA */}
          <div className="nav-actions-desktop">
            <button
              type="button"
              className="lang-toggle-btn"
              onClick={toggleLanguage}
              title={language === 'en' ? 'التحويل للمصري' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <i className="fa-solid fa-globe" />
              <span className="lang-toggle-badge">{language === 'en' ? 'EG' : 'EN'}</span>
            </button>

            <a className="nav-cta" href="#roadmaps" onClick={() => sfx.playClick()}>
              {t('nav', 'exploreBtn', 'Explore Paths')}
              <span className="cta-arrow">
                <i className="fa-solid fa-arrow-right" />
              </span>
            </a>
          </div>

          {/* Mobile Right Controls: Language Switcher & Burger Menu */}
          <div className="nav-mobile-actions">
            <button
              type="button"
              className="lang-toggle-btn mobile-lang-btn"
              onClick={toggleLanguage}
              title={language === 'en' ? 'التحويل للمصري' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <i className="fa-solid fa-globe" />
              <span className="lang-toggle-badge">{language === 'en' ? 'EG' : 'EN'}</span>
            </button>

            <button
              className={`nav-toggle ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden={!mobileMenuOpen}
      />

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-header">
          <div className="brand">
            <span className="brand-mark">
              <i className="fa-solid fa-terminal" />
            </span>
            <span className="brand-word">
              {siteConfig.brand.name}<i>.</i>
            </span>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => {
              sfx.playClick();
              closeMobileMenu();
            }}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="mobile-drawer-links">
          {siteConfig.navLinks.map((link) => {
            const targetId = link.href.replace('#', '');
            const isActive = activeSection === targetId;
            const label = navLinkLabels[link.href] || link.label;
            return (
              <a
                key={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                href={link.href}
                onClick={handleNavLinkClick}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div className="mobile-drawer-footer">
          <a
            href="#roadmaps"
            className="btn-main mobile-cta"
            onClick={handleNavLinkClick}
          >
            {t('nav', 'exploreBtn', 'Explore Roadmaps')} <i className="fa-solid fa-arrow-right" />
          </a>

          <div className="mobile-socials-row">
            {siteConfig.socials.slice(0, 4).map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-icon"
                aria-label={s.label}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
