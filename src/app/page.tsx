'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateGame } from '@/components/lobby/CreateGame';
import { JoinGame } from '@/components/lobby/JoinGame';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl font-display font-extrabold text-neon-cyan text-glow-cyan mb-3 tracking-tight">
            HITS
          </h1>
          <p className="text-text-muted text-sm tracking-wide">The music timeline game</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Button
                onClick={() => setMode('create')}
                className="w-full py-5 text-lg"
                size="lg"
              >
                Create Game
              </Button>
              <Button
                onClick={() => setMode('join')}
                variant="secondary"
                className="w-full py-5 text-lg"
                size="lg"
              >
                Join Game
              </Button>
            </motion.div>
          )}

          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-2xl p-6"
            >
              <h2 className="text-xl font-display font-bold text-text-primary mb-4">Create New Game</h2>
              <CreateGame />
              <button
                onClick={() => setMode('choose')}
                className="mt-4 text-text-muted hover:text-text-primary text-sm transition-colors cursor-pointer"
              >
                ← Back
              </button>
            </motion.div>
          )}

          {mode === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-2xl p-6"
            >
              <h2 className="text-xl font-display font-bold text-text-primary mb-4">Join Game</h2>
              <JoinGame />
              <button
                onClick={() => setMode('choose')}
                className="mt-4 text-text-muted hover:text-text-primary text-sm transition-colors cursor-pointer"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-8 text-center text-text-dim text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Powered by Spotify</p>
        </motion.div>
      </div>
    </div>
  );
}
