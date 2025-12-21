import { motion } from 'framer-motion';
import { Sparkles, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero = ({ onStart }: LandingHeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-card-strong p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Decorative elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-relaxed"
        >
          Time Capsule
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 font-light"
        >
          Seal your commitments. Revisit when time allows.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground">
            <Lock className="w-4 h-4" />
            <span>Sealed until you decide</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-secondary-foreground">
            <Clock className="w-4 h-4" />
            <span>Your timeline, your pace</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onStart}
            className="group"
          >
            <span>Create Your Capsule</span>
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
          </Button>
        </motion.div>

        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10"
        >
          <span className="text-accent font-semibold">✨ 2025</span>
          <span className="text-muted-foreground text-sm">New Year Edition</span>
        </motion.div>
      </motion.div>
    </div>
  );
};
