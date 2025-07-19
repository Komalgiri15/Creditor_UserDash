// speechify.js

// Speechify Player implementation
export class SpeechifyPlayer {
  constructor() {
    // Initialize any required properties
  }

  play() {
    // Implementation will be provided by the Speechify SDK
    if (window.speechify && window.speechify.player) {
      return window.speechify.player.play();
    }
    console.warn('Speechify player not available');
  }

  pause() {
    if (window.speechify && window.speechify.player) {
      return window.speechify.player.pause();
    }
    console.warn('Speechify player not available');
  }

  setVolume(volume) {
    if (window.speechify && window.speechify.player) {
      return window.speechify.player.setVolume(volume);
    }
    console.warn('Speechify player not available');
  }

  setRate(rate) {
    if (window.speechify && window.speechify.player) {
      return window.speechify.player.setRate(rate);
    }
    console.warn('Speechify player not available');
  }

  setPosition(position) {
    if (window.speechify && window.speechify.player) {
      return window.speechify.player.setPosition(position);
    }
    console.warn('Speechify player not available');
  }
}

// Initialize Speechify
export const initSpeechify = (options) => {
  if (window.speechify) {
    return window.speechify.init({
      text: options.text,
      beforePause: options.beforePause || (() => {}),
      beforePlay: options.beforePlay || (() => {}),
      onTextHighlighted: options.onTextHighlighted || (() => {})
    });
  }
  console.warn('Speechify not available');
};

// Create a singleton instance of the player
export const speechifyPlayer = new SpeechifyPlayer();

// Export default object that mimics the window.speechify interface
const speechify = {
  init: initSpeechify,
  player: speechifyPlayer
};

// Export the speechify object
export default speechify;

// Usage in your components:
// import speechify, { speechifyPlayer } from './path/to/speechify';
// 
// speechify.init({
//   text: 'Your text here',
//   onTextHighlighted: (info) => {
//     console.log('Text highlighted:', info.text, 'from', info.range.start, 'to', info.range.end);
//   }
// });
// 
// speechifyPlayer.play();
// speechifyPlayer.pause();
// etc.