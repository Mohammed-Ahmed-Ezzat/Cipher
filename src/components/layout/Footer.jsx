import React from 'react';
import { siteConfig } from '../../data/siteConfig';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container-xl footer-simple">
        <a href="#home" className="brand footer-brand-link">
          <span className="brand-mark">
            <i className="fa-solid fa-terminal"></i>
          </span>
          <span className="brand-word">
            {siteConfig.brand.name}<i>.</i>
          </span>
        </a>
        <p className="footer-tagline">{siteConfig.brand.tagline}</p>
      </div>

      <div className="footer-divider" />

      <div className="container-xl footer-bottom">
        <div className="footer-meta">© {new Date().getFullYear()} Cipher. All rights reserved.</div>
        <div className="footer-credit">
          Crafted with care by{' '}
          <a
            href={siteConfig.author.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="credit-name"
          >
            {siteConfig.author.name}
          </a>
        </div>
      </div>
    </footer>
  );
}
