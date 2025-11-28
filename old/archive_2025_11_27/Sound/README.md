# Sound Effects for Undercover Game

This directory contains all sound effects used in the application.

## Files

### timer-tick.mp3
- **Usage:** Played during the last 10 seconds of the vote timer
- **Duration:** ~0.1s
- **Description:** Short tick sound

### timer-end.mp3
- **Usage:** Played when the vote timer expires
- **Duration:** ~0.5s
- **Description:** Alert beep sound (800Hz sine wave)

### vote-cast.mp3
- **Usage:** Played when a player casts their vote
- **Duration:** ~0.2s
- **Description:** Confirmation click sound

### elimination.mp3
- **Usage:** Played when a player is eliminated
- **Duration:** ~0.8s
- **Description:** Dramatic sound effect

### win.mp3
- **Usage:** Played when the game ends with a winner
- **Duration:** ~1.5s
- **Description:** Victory fanfare

### card-flip.mp3
- **Usage:** Played when revealing the secret word card
- **Duration:** ~0.3s
- **Description:** Card flip/whoosh sound

## Implementation

These sounds are loaded and played using the HTML5 Audio API:

```javascript
const sounds = {
    timerTick: new Audio('sounds/timer-tick.mp3'),
    timerEnd: new Audio('sounds/timer-end.mp3'),
    voteCast: new Audio('sounds/vote-cast.mp3'),
    elimination: new Audio('sounds/elimination.mp3'),
    win: new Audio('sounds/win.mp3'),
    cardFlip: new Audio('sounds/card-flip.mp3')
};

function playSound(soundName) {
    if (game.settings.soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play();
    }
}
```

## Note

Currently, the application uses the Web Audio API to generate sounds programmatically. These MP3 files are placeholders for future implementation with actual audio files.

To add real audio files:
1. Replace these placeholder files with actual MP3 files
2. Ensure they are optimized for web (small file size, appropriate bitrate)
3. Test on all target browsers for compatibility
