import React from 'react';
import { siteConfig } from '../../data/siteConfig';

export default function AboutSection() {
  const { about } = siteConfig;

  return (
    <section id="intro">
      <div className="container-xl">
        <div className="intro-grid">
          <div className="intro-copy reveal-on-scroll">
            <div className="section-kicker">03 / Intro</div>
            <h2 className="section-title">
              Who is <span className="gradient">Cipher?</span>
            </h2>
            <p>
              Maybe you've heard about us before. Maybe this is your first time seeing us.
              Either way, let's introduce ourselves.
            </p>
            <p>
              Cipher is a voluntary student activity at Sohag University. Our goal is to help
              students discover technology and programming fields and start their journey with
              clear steps.
            </p>
            <p>
              We believe every student can start, regardless of their current level or
              experience. Sometimes, all you need is someone to point you toward the first step.
            </p>
          </div>

          <div className="info-panel reveal-on-scroll">
            <div className="info-row">
              <div className="info-icon">
                <i className="fa-solid fa-building-columns" />
              </div>
              <div className="info-content-wide">
                <div className="info-label">Team</div>
                <div className="info-value team-value">{about.team}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <div>
                <div className="info-label">Category</div>
                <div className="info-value">{about.category}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <i className="fa-solid fa-location-dot" />
              </div>
              <div>
                <div className="info-label">Location</div>
                <div className="info-value">{about.location}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <i className="fa-solid fa-envelope" />
              </div>
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">
                  <a href={`mailto:${about.email}`}>{about.email}</a>
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <i className="fa-solid fa-share-nodes" />
              </div>
              <div>
                <div className="info-label">Connect</div>
                <div className="info-value">
                  <a
                    href="https://www.linkedin.com/company/ciphersohag/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>{' '}
                  ·{' '}
                  <a
                    href="https://www.facebook.com/CipherSohag"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>{' '}
                  ·{' '}
                  <a
                    href="https://www.youtube.com/@cipherteam2019"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
