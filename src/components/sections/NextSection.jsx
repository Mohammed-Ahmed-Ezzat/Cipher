import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function NextSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section id="next">
      <div className="container-xl">
        <div className="next-wrap reveal-on-scroll">
          <div className="section-kicker">{t('next', 'kicker', "05 / What's Next")}</div>
          <h2 className="section-title">
            {t('next', 'title', 'This is only')}{' '}
            <span className="gradient">{t('next', 'titleGradient', 'the beginning.')}</span>
          </h2>
          <p>
            {t('next', 'p1', 'The coming period will bring new content, clearer introductions to programming fields, more roadmaps, workshops, camps, events, and activities inside and outside the university.')}
          </p>
          <p>
            {t('next', 'p2', 'Whether you are just starting university or already several years in, there will be something here to help you answer the questions you may be stuck on.')}
          </p>
          <p>
            {t('next', 'p3', 'And keep an eye out — Applications to join us will open again very soon. If you want to become part of Cipher and help create real impact, start preparing from now.')}
          </p>
          <a className="recruit" href="#footer">
            <i className="fa-solid fa-bolt" /> {t('next', 'btn', 'Get Ready to Join Us')}
          </a>
        </div>
      </div>
    </section>
  );
}
