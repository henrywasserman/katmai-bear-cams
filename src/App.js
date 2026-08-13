import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const bearCams = [
  { id: 1, name: "Brooks Falls", videoId: "J7ZrIDvqlic" },
  { id: 2, name: "Lower River", videoId: "EwTH5yY7Mks" },
  { id: 3, name: "Riffles", videoId: "z7_GhJeFxQI" },
  { id: 4, name: "River Watch", videoId: "wkVLYfU-Kew" },
  { id: 5, name: "Kat's River View", videoId: "cTsjMtjRLCo" },
  { id: 6, name: "Underwater Cam", videoId: "vu7I315gQpU" }
];

function App() {
  const [focusedId, setFocusedId] = useState(null);
  const players = useRef({});
  const initialized = useRef(false);

  useEffect(() => {
    // Guard against StrictMode's double-invoke creating duplicate players,
    // which would play overlapping copies of each stream (audible as a buzz).
    if (initialized.current) return;
    initialized.current = true;

    const initPlayers = () => {
      bearCams.forEach(({ id, videoId }) => {
        players.current[id] = new window.YT.Player(`player-${id}`, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0 },
          events: { onReady: (e) => e.target.mute() },
        });
      });
    };

    if (window.YT?.Player) {
      initPlayers();
    } else {
      window.onYouTubeIframeAPIReady = initPlayers;
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  }, []);

  // Return to the grid: every stream muted and playing again.
  const resetAll = () => {
    bearCams.forEach(cam => {
      try {
        players.current[cam.id]?.mute();
        players.current[cam.id]?.playVideo();
      } catch {}
    });
    setFocusedId(null);
    document.exitFullscreen?.();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') resetAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClick = (id) => {
    if (focusedId === id) {
      resetAll();
      return;
    }

    // Pause the other streams so the focused one isn't fighting them for
    // decode/audio bandwidth (they're hidden behind fullscreen anyway).
    bearCams.forEach(cam => {
      if (cam.id !== id) {
        try {
          players.current[cam.id]?.mute();
          players.current[cam.id]?.pauseVideo();
        } catch {}
      }
    });
    try {
      players.current[id]?.playVideo();
      players.current[id]?.unMute();
    } catch {}
    setFocusedId(id);

    const card = document.getElementById(`player-${id}`)?.parentElement;
    card?.requestFullscreen?.().catch(() => {});
  };

  return (
    <div className="grid">
      {bearCams.map(cam => (
        <div
          key={cam.id}
          className={`card ${focusedId === cam.id ? 'focused' : ''}`}
          onClick={() => handleClick(cam.id)}
        >
          <div className="card-header">{cam.name}</div>
          <div id={`player-${cam.id}`} className="player-div" />
        </div>
      ))}
    </div>
  );
}

export default App;
