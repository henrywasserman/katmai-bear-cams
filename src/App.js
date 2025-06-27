import React, { useState, useEffect } from 'react';
import './App.css';

const bearCams = [
  { id: 1, name: "Brooks Falls", url: "https://www.youtube.com/embed/73-EekdVVU8?autoplay=1&mute=1" },
  { id: 2, name: "Lower River", url: "https://www.youtube.com/embed/UHgF74ieHUM?autoplay=1&mute=1" },
  { id: 3, name: "Riffles", url: "https://www.youtube.com/embed/LM1YPBWn5jQ?autoplay=1&mute=1" },
  { id: 4, name: "Falls Platform", url: "https://www.youtube.com/embed/-W_CTboaB4A?autoplay=1&mute=1" },
  { id: 5, name: "River Watch", url: "https://www.youtube.com/embed/vZ1e_m8Tl04?autoplay=1&mute=1" },
  { id: 6, name: "Falls Trail", url: "https://www.youtube.com/embed/pfH8hlk2fUc?autoplay=1&mute=1" }
];

function App() {
  const [focusedId, setFocusedId] = useState(null);

  const handleClick = (id) => {
    setFocusedId(focusedId === id ? null : id);
  };

  // Escape key to exit full-screen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setFocusedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`grid ${focusedId ? 'fullscreen-mode' : ''}`}>
      {bearCams.map(cam => (
        <div
          key={cam.id}
          className={`card ${focusedId === cam.id ? 'focused' : ''}`}
          onClick={() => handleClick(cam.id)}
        >
          <div className="card-header">{cam.name}</div>
          <iframe
            src={cam.url}
            title={cam.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}

export default App;