import React, { useState } from 'react';
import { sfx } from '../../utils/soundEffects';

export default function SoundToggle() {
  const [muted, setMuted] = useState(sfx.isMuted());

  const handleToggle = () => {
    const isNowMuted = sfx.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <button
      className={`sound-toggle-btn ${!muted ? 'active' : ''}`}
      onClick={handleToggle}
      aria-label={muted ? 'Enable sound effects' : 'Mute sound effects'}
      title={muted ? 'Enable sound effects' : 'Mute sound'}
    >
      <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`} />
      {!muted && (
        <span className="sound-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
    </button>
  );
}
