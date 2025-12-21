import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Calendar, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateCapsuleProps {
  onBack: () => void;
  onComplete: (capsule: Capsule) => void;
}

export interface Capsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  isSealed: boolean;
}

export const CreateCapsule = ({ onBack, onComplete }: CreateCapsuleProps) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [isSealing, setIsSealing] = useState(false);

  const handleSeal = async () => {
    if (!title || !message || !unlockDate) return;
    
    setIsSealing(true);
    
    // Simulate sealing animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const capsule: Capsule = {
      id: Date.now().toString(),
      title,
      message,
      unlockDate,
      createdAt: new Date().toISOString(),
      isSealed: true,
    };
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('capsules') || '[]');
    localStorage.setItem('capsules', JSON.stringify([...existing, capsule]));
    
    onComplete(capsule);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card-strong p-8 md:p-10 max-w-xl w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {/* Progress indicator */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-primary w-6' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Name Your Capsule
                </h2>
                <p className="text-muted-foreground">
                  Give your time capsule a meaningful title
                </p>
              </div>

              <Input
                type="text"
                placeholder={`My ${new Date().getFullYear()} Goals...`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-14 text-lg bg-secondary/30 border-secondary focus:border-primary/50"
              />

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!title.trim()}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Your Message
                </h2>
                <p className="text-muted-foreground">
                  Write to your future self
                </p>
              </div>

              <Textarea
                placeholder="Dear future me..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px] text-base bg-secondary/30 border-secondary focus:border-primary/50 resize-none"
              />

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!message.trim()}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Set Unlock Date
                </h2>
                <p className="text-muted-foreground">
                  When should this capsule open?
                </p>
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  value={unlockDate}
                  min={minDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="h-14 pl-12 text-lg bg-secondary/30 border-secondary focus:border-primary/50"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="golden"
                  size="lg"
                  className="flex-1"
                  onClick={handleSeal}
                  disabled={!unlockDate || isSealing}
                >
                  {isSealing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Sealing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Seal Capsule
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
