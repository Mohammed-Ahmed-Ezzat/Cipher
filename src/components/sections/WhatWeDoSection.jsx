import React from 'react';
import { siteConfig } from '../../data/siteConfig';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatWeDoSection() {
  const { t, isRTL } = useLanguage();
  const translatedItems = t('whatWeDo', 'items', siteConfig.whatWeDo);

  return (
    <section id="what-we-do">
      <div className="container-xl">
        <div className="section-head reveal-on-scroll">
          <div className="section-kicker">{t('whatWeDo', 'kicker', '04 / What We Do')}</div>
          <h2 className="section-title">
            {t('whatWeDo', 'title', 'More than just')}{' '}
            <span className="gradient">{t('whatWeDo', 'titleGradient', 'information.')}</span>
          </h2>
          <p className="section-desc">
            {t('whatWeDo', 'desc', 'Throughout the season, Cipher creates experiences that help students learn, practice, and see technology from a clearer perspective.')}
          </p>
        </div>

        <div className="do-grid reveal-stagger">
          {siteConfig.whatWeDo.map((item, index) => {
            const currentItem = translatedItems[index] || item;
            return (
              <div
                key={index}
                className="do-card"
                style={{ '--accent': item.accent }}
              >
                <div className="do-icon">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h3>{currentItem.title}</h3>
                <p>{currentItem.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
