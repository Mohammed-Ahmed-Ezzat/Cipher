import React, { useState } from 'react';
import { siteConfig } from '../../data/siteConfig';
import { sfx } from '../../utils/soundEffects';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const handleToggle = (index) => {
    sfx.playClick();
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq">
      <div className="container-xl">
        <div className="faq-head-wrap reveal-on-scroll">
          <div className="section-kicker">06 / FAQ & Guidance</div>
          <h2 className="section-title">
            Frequently Asked <span className="gradient">Questions.</span>
          </h2>
          <p className="section-desc">
            Got questions about starting with Cipher, attending camps, or joining the team?
            Here are the answers to the most common inquiries.
          </p>
        </div>

        <div className="faq-accordion-list reveal-stagger">
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  id={`faq-btn-${index}`}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-num">0{index + 1}</span>
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-indicator" aria-hidden="true">
                    <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`} />
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className="faq-answer-panel"
                >
                  <div className="faq-answer-inner">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
