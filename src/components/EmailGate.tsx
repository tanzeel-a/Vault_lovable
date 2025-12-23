import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Mail } from 'lucide-react';
import { playClickSound } from '@/lib/sounds';
import { toast } from 'sonner';

interface EmailGateProps {
    onAccessGranted: () => void;
}

export const EmailGate = ({ onAccessGranted }: EmailGateProps) => {
    const [email, setEmail] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        playClickSound();

        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        localStorage.setItem('user_email', email);
        setIsVisible(false);
        setTimeout(onAccessGranted, 500); // Wait for exit animation
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="glass-card-strong w-full max-w-md p-8 text-center"
                    >
                        <div className="mb-6 flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                        </div>

                        <h2 className="font-display text-3xl mb-2">Welcome</h2>
                        <p className="text-muted-foreground mb-8">
                            Please enter your email to continue to your time capsule.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 bg-background/50"
                                    autoFocus
                                />
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg group">
                                <span>Enter Capsule</span>
                                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                            </Button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
