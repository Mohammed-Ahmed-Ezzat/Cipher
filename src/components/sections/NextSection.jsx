import React from 'react';

export default function NextSection() {
  return (
    <section id="next">
      <div className="container-xl">
        <div className="next-wrap reveal-on-scroll">
          <div className="section-kicker">05 / What's Next</div>
          <h2 className="section-title">This is only the beginning.</h2>
          <p>
            The coming period will bring new content, clearer introductions to programming
            fields, more roadmaps, workshops, camps, events, and activities inside and outside
            the university.
          </p>
          <p>
            Whether you are just starting university or already several years in, there will
            be something here to help you answer the questions you may be stuck on.
          </p>
          <p>
            And keep an eye out —{' '}
            <strong style={{ color: '#fff' }}>
              Applications to join us will open again very soon.
            </strong>{' '}
            If you want to become part of Cipher and help create real impact, start preparing
            from now.
          </p>
          <a className="recruit" href="#footer">
            <i className="fa-solid fa-bolt" /> Get Ready to Join Us
          </a>
        </div>
      </div>
    </section>
  );
}
