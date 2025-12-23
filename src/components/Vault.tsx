import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Lock, Unlock, Calendar, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Capsule } from './CreateCapsule';
import { playClickSound } from '@/lib/sounds';
import { supabase } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VaultProps {
  onCreateNew: () => void;
}

export const Vault = ({ onCreateNew }: VaultProps) => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapsules = async () => {
      const userEmail = localStorage.getItem('user_email');

      // Try Supabase first
      if (supabase && userEmail) {
        const { data, error } = await supabase
          .from('capsules')
          .select('*')
          .eq('user_email', userEmail)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped = data.map((c: any) => ({
            id: c.id,
            title: c.title,
            message: c.message,
            unlockDate: c.unlock_date,
            createdAt: c.created_at,
            isSealed: !c.is_opened,
          }));
          setCapsules(mapped);
          setLoading(false);
          return;
        }
      }

      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('capsules') || '[]');
      setCapsules(stored);
      setLoading(false);
    };

    fetchCapsules();
  }, []);

  const canUnlock = (unlockDate: string) => {
    return new Date(unlockDate) <= new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntil = (unlockDate: string) => {
    const diff = new Date(unlockDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleDelete = async (id: string) => {
    // Delete from Supabase
    if (supabase) {
      const { error } = await supabase.from('capsules').delete().eq('id', id);
      if (error) {
        // We might want to show a toast here, but for now we'll proceed to delete locally too
      }
    }

    const updated = capsules.filter((c) => c.id !== id);
    setCapsules(updated);
    localStorage.setItem('capsules', JSON.stringify(updated));
    setDeleteId(null);
  };

  const handleOpenCapsule = async (capsule: Capsule) => {
    if (!capsule.isSealed) {
      setSelectedCapsule(capsule);
      return;
    }

    // Update Supabase
    if (supabase) {
      const { error } = await supabase
        .from('capsules')
        .update({ is_opened: true })
        .eq('id', capsule.id);

      if (error) {
        // Silently fail for now
      }
    }

    // Update local state
    const updatedCapsules = capsules.map(c =>
      c.id === capsule.id ? { ...c, isSealed: false } : c
    );
    setCapsules(updatedCapsules);
    localStorage.setItem('capsules', JSON.stringify(updatedCapsules));

    setSelectedCapsule({ ...capsule, isSealed: false });
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Your Vault
          </h1>
          <p className="text-muted-foreground text-lg">
            {capsules.length} capsule{capsules.length !== 1 ? 's' : ''} waiting
          </p>
        </motion.div>

        {/* Capsules Grid */}
        {capsules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No capsules yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first time capsule to get started
            </p>
            <Button variant="hero" size="lg" onClick={() => { playClickSound(); onCreateNew(); }}>
              <Plus className="w-5 h-5 mr-2" />
              Create Capsule
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <AnimatePresence>
                {capsules.map((capsule, index) => {
                  const unlockable = canUnlock(capsule.unlockDate);
                  const daysLeft = getDaysUntil(capsule.unlockDate);

                  return (
                    <motion.div
                      key={capsule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      className={`glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${unlockable ? 'border-accent/50 hover:border-accent' : ''
                        }`}
                      onClick={() => unlockable && handleOpenCapsule(capsule)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${unlockable ? 'bg-accent/20' : 'bg-secondary'}`}>
                          {unlockable ? (
                            <Unlock className="w-6 h-6 text-accent" />
                          ) : (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(capsule.id);
                          }}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {capsule.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>Opens {formatDate(capsule.unlockDate)}</span>
                      </div>

                      {unlockable ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                          <Sparkles className="w-3 h-3" />
                          Ready to open!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                          <Lock className="w-3 h-3" />
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Button variant="outline" size="lg" onClick={() => { playClickSound(); onCreateNew(); }}>
                <Plus className="w-5 h-5 mr-2" />
                Create Another Capsule
              </Button>
            </motion.div>
          </>
        )}

        {/* View Capsule Modal */}
        <AnimatePresence>
          {selectedCapsule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCapsule(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-card-strong p-8 max-w-lg w-full max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl">{selectedCapsule.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDate(selectedCapsule.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-xl p-6 mb-6">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {selectedCapsule.message}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedCapsule(null)}
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this capsule?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The capsule and its contents will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
