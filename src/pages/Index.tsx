import { useState, useEffect } from 'react';
import snowBackground from '@/assets/snow-background.jpg';
import { Snowfall } from '@/components/Snowfall';
import { LandingHero } from '@/components/LandingHero';
import { CreateCapsule, Capsule } from '@/components/CreateCapsule';
import { Vault } from '@/components/Vault';
import { SealedSuccess } from '@/components/SealedSuccess';
import { MusicPlayer } from '@/components/MusicPlayer';

type View = 'landing' | 'create' | 'vault' | 'success';

const Index = () => {
  const [view, setView] = useState<View>('landing');
  const [sealedCapsule, setSealedCapsule] = useState<Capsule | null>(null);

  useEffect(() => {
    const hasCapsules = JSON.parse(localStorage.getItem('capsules') || '[]').length > 0;
    if (hasCapsules) {
      setView('vault');
    }
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
          backgroundImage: `url(${snowBackground})`,
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

      {/* Music Player */}
      <MusicPlayer />

      {/* Main Content */}
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
    </div>
  );
};

export default Index;
