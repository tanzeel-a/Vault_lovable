// Sound URLs - using royalty-free sounds
const SOUNDS = {
  click: 'https://cdn.pixabay.com/audio/2022/03/10/audio_942e39c870.mp3',
  lock: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3',
  success: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
};

// Audio cache
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Preload sounds for instant playback
export const preloadSounds = () => {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    audio.volume = key === 'click' ? 0.3 : 0.5;
    audioCache.set(key, audio);
  });
};

// Play a sound with fallback
const playSound = (soundKey: keyof typeof SOUNDS) => {
  try {
    let audio = audioCache.get(soundKey);
    
    if (!audio) {
      audio = new Audio(SOUNDS[soundKey]);
      audio.volume = soundKey === 'click' ? 0.3 : 0.5;
      audioCache.set(soundKey, audio);
    }
    
    // Clone the audio for overlapping plays
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.play().catch(() => {
      // Silently fail - likely blocked by browser
    });
  } catch {
    // Silently fail
  }
};

export const playClickSound = () => playSound('click');
export const playLockSound = () => playSound('lock');
export const playSuccessSound = () => playSound('success');
