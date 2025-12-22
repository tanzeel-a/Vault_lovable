import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Capsule } from './CreateCapsule';
import { playClickSound, playSuccessSound } from '@/lib/sounds';

interface SealedSuccessProps {
  capsule: Capsule;
  onViewVault: () => void;
  onCreateAnother: () => void;
}

export const SealedSuccess = ({ capsule, onViewVault, onCreateAnother }: SealedSuccessProps) => {
  // Play success sound on mount
  playSuccessSound();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="glass-card-strong p-8 md:p-12 max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-accent flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-accent-foreground" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display text-2xl md:text-3xl text-foreground mb-3"
        >
          Sealed!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground mb-8"
        >
          Your capsule "{capsule.title}" is now safely stored
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-secondary/40 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-accent mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Opens on</span>
          </div>
          <p className="text-xl font-medium text-foreground">
            {formatDate(capsule.unlockDate)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => { playClickSound(); onCreateAnother(); }}
          >
            Create Another
          </Button>
          <Button
            variant="hero"
            size="lg"
            className="flex-1"
            onClick={() => { playClickSound(); onViewVault(); }}
          >
            View Vault
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
