"use client";

import { useState, useEffect, useRef } from 'react';
import { Snowfall } from '@/components/Snowfall';
import { LandingHero } from '@/components/LandingHero';
import { CreateCapsule, Capsule } from '@/components/CreateCapsule';
import { Vault } from '@/components/Vault';
import { SealedSuccess } from '@/components/SealedSuccess';
import { EmailGate } from '@/components/EmailGate';
import { preloadSounds } from '@/lib/sounds';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AMBIENT_MUSIC_URL = '/audio/happynewyear.mp3';

type View = 'landing' | 'create' | 'vault' | 'success';

const Index = () => {
  const [view, setView] = useState<View>('landing');
  const [sealedCapsule, setSealedCapsule] = useState<Capsule | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Check for email access
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      setHasAccess(true);
    }

    const hasCapsules = JSON.parse(localStorage.getItem('capsules') || '[]').length > 0;
    if (hasCapsules) {
      setView('vault');
    }

    // Preload sounds
    preloadSounds();

    // Setup background music
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.1;
    audio.src = AMBIENT_MUSIC_URL;
    audioRef.current = audio;

    // Play on first user interaction (required by browsers)
    const startMusic = () => {
      if (!hasInteracted.current && audioRef.current) {
        hasInteracted.current = true;
        audioRef.current.play().catch(() => { });
      }
    };

    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);

    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleCapsuleComplete = (capsule: Capsule) => {
    setSealedCapsule(capsule);
    setView('success');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/snow-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      {/* Snowfall Effect */}
      <Snowfall />

      {/* Email Gate */}
      {!hasAccess && (
        <EmailGate onAccessGranted={() => setHasAccess(true)} />
      )}

      {/* Main Content */}
      {hasAccess && (
        <>
          {/* Home Button */}
          {view !== 'landing' && (
            <Button
              variant="glass"
              size="icon"
              className="fixed top-4 left-4 z-50"
              onClick={() => setView('landing')}
            >
              <Home className="w-5 h-5" />
            </Button>
          )}

          <main className="relative z-20">
            {view === 'landing' && (
              <LandingHero onStart={() => setView('create')} />
            )}

            {view === 'create' && (
              <CreateCapsule
                onBack={() => {
                  const hasCapsules = JSON.parse(localStorage.getItem('capsules') || '[]').length > 0;
                  setView(hasCapsules ? 'vault' : 'landing');
                }}
                onComplete={handleCapsuleComplete}
              />
            )}

            {view === 'vault' && (
              <Vault onCreateNew={() => setView('create')} />
            )}

            {view === 'success' && sealedCapsule && (
              <SealedSuccess
                capsule={sealedCapsule}
                onViewVault={() => setView('vault')}
                onCreateAnother={() => setView('create')}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 z-20 py-4 text-center">
            <p className="text-sm text-muted-foreground/80">
              Made with intention by{' '}
              <span
                className="cursor-pointer border-b border-dashed border-muted-foreground/40 hover:text-foreground transition-colors"
                onClick={() => alert("This project exists to remind us that time is a friend, not a boss. - Tanzeel")}
              >
                Tanzeel
              </span>
            </p>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
