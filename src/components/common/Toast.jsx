import React from 'react';

export default function Toast({ message, show }) {
  return (
    <div className={`copy-toast ${show ? 'show' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
