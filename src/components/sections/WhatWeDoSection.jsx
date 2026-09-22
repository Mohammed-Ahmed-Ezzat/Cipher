import React from 'react';
import { siteConfig } from '../../data/siteConfig';

export default function WhatWeDoSection() {
  return (
    <section id="what-we-do">
      <div className="container-xl">
        <div className="section-head reveal-on-scroll">
          <div className="section-kicker">04 / What We Do</div>
          <h2 className="section-title">More than just information.</h2>
          <p className="section-desc">
            Throughout the season, Cipher creates experiences that help students learn,
            practice, and see technology from a clearer perspective.
          </p>
        </div>

        <div className="do-grid reveal-stagger">
          {siteConfig.whatWeDo.map((item, index) => (
            <div
              key={index}
              className="do-card"
              style={{ '--accent': item.accent }}
            >
              <div className="do-icon">
                <i className={`fa-solid ${item.icon}`} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
