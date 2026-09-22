import React from 'react';
import { siteConfig } from '../../data/siteConfig';

export default function ConnectSection({ onCopyEmail }) {
  const handleTileClick = (e, item) => {
    if (item.isEmail) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(item.handle).catch(() => {});
        onCopyEmail();
      }
    }
  };

  return (
    <section id="connect">
      <div className="container-xl">
        <div className="connect-head-wrap reveal-on-scroll">
          <div className="section-kicker">07 / Connect</div>
          <h2 className="section-title">
            Let's stay <span className="gradient">connected.</span>
          </h2>
          <p className="section-desc">
            Got a question, an idea, or just want to say hi? Cipher is one message away — pick
            whichever channel feels right.
          </p>
          <div className="connect-actions">
            <a
              className="btn-main"
              href="https://www.facebook.com/CipherSohag"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Community <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
            <a className="btn-ghost" href="mailto:cipherteam77@gmail.com">
              Message Us <i className="fa-solid fa-paper-plane" />
            </a>
          </div>
        </div>

        <div className="connect-grid reveal-stagger">
          {siteConfig.socials.map((item) => (
            <a
              key={item.id}
              className="connect-tile"
              style={{ '--accent': item.accent }}
              href={item.href}
              target={item.isEmail ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => handleTileClick(e, item)}
            >
              <i className="fa-solid fa-arrow-up-right-from-square connect-go" />
              <div className="connect-icon">
                <i className={item.icon} />
              </div>
              <div className="connect-label">{item.label}</div>
              <div className="connect-value">{item.handle}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
