import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Royalty-free ambient winter music
const AMBIENT_MUSIC_URL = 'https://cdn.pixabay.com/audio/2024/11/29/audio_cf29d4efb8.mp3';

// Lock sound effect
const LOCK_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3';

// Global audio for lock sound
let lockAudio: HTMLAudioElement | null = null;

export const playLockSound = () => {
  if (!lockAudio) {
    lockAudio = new Audio(LOCK_SOUND_URL);
    lockAudio.volume = 0.5;
  }
  lockAudio.currentTime = 0;
  lockAudio.play().catch(() => {});
};

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(AMBIENT_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);

    // Hide tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => {
      clearTimeout(tooltipTimer);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowTooltip(false);
        })
        .catch((error) => {
          console.log('Audio playback failed:', error);
        });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999]" style={{ pointerEvents: 'auto' }}>
      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && isLoaded && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="glass-card px-4 py-2 text-sm text-foreground flex items-center gap-2">
                <Music className="w-4 h-4 text-accent" />
                <span>Play ambient music</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Button */}
        <motion.button
          type="button"
          onClick={toggleMusic}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg cursor-pointer
            ${isPlaying 
              ? 'bg-primary text-primary-foreground' 
              : 'glass-card text-foreground hover:bg-card/90'
            }
            ${!isLoaded ? 'opacity-50' : ''}
          `}
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}

          {/* Playing indicator */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary-foreground/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.button>

        {/* Sound wave animation when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-accent rounded-full"
                  animate={{ height: ['4px', '12px', '4px'] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
