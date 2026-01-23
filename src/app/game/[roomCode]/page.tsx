'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useGameActions } from '@/hooks/useGameActions';
import { GameHeader } from '@/components/game/GameHeader';
import { AllTimelines } from '@/components/game/AllTimelines';
import { CurrentCard } from '@/components/game/CurrentCard';
import { TokenActions } from '@/components/game/TokenActions';
import { ChallengeButton } from '@/components/game/ChallengeButton';
import { WinnerModal } from '@/components/game/WinnerModal';
import { YouTubePlayer, WaitingForSong } from '@/components/youtube/YouTubePlayer';
import { Button } from '@/components/ui/Button';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after first render (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      router.push('/');
    }
  }, [mounted, router]);

  const { socket, gameState, isConnected } = useSocket(roomCode, mounted ? playerId : null);
  const {
    playSong,
    songPlayed,
    placeCard,
    challenge,
    skipTurn,
    skipSong,
    freeCard,
    nextTurn,
  } = useGameActions(roomCode, socket);

  const handleReturnHome = () => {
    router.push('/');
  };

  if (!mounted || !playerId || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">
          {!mounted ? 'Loading...' : !isConnected ? 'Connecting...' : 'Loading game...'}
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentDj = gameState.players[gameState.currentDjIndex];
  const myPlayer = gameState.players.find((p) => p.id === playerId);
  const isMyTurn = currentPlayer?.id === playerId;
  const amDj = currentDj?.id === playerId;

  const handlePlaceCard = (position: number) => {
    if (playerId && isMyTurn) {
      placeCard(playerId, position);
    }
  };

  const handleChallenge = (position: number) => {
    if (playerId) {
      challenge(playerId, position);
    }
  };

  const handleSkip = () => {
    if (playerId) {
      skipTurn(playerId);
    }
  };

  const handleFreeCard = () => {
    if (playerId) {
      freeCard(playerId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="p-3">
        <GameHeader game={gameState} currentPlayerId={playerId} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
        {/* Current Card / YouTube Player */}
        <div>
          {gameState.phase === 'PLAYING_SONG' && gameState.currentCard ? (
            amDj ? (
              <YouTubePlayer
                videoId={gameState.currentCard.youtubeId}
                onSongPlayed={songPlayed}
                onSkipSong={skipSong}
                isDj={amDj}
                djName={currentDj?.name}
              />
            ) : (
              <WaitingForSong djName={currentDj?.name || 'DJ'} />
            )
          ) : gameState.phase === 'PLAYING_SONG' && !gameState.currentCard && amDj ? (
            <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
              <Button onClick={playSong} className="w-full" size="lg">
                Draw & Play Next Song
              </Button>
            </div>
          ) : (
            <CurrentCard
              card={gameState.currentCard}
              phase={gameState.phase}
              showYear={gameState.phase === 'REVEAL' || gameState.phase === 'RESULT'}
            />
          )}
        </div>

        {/* Challenge Button */}
        <ChallengeButton
          game={gameState}
          currentPlayerId={playerId}
          onChallenge={handleChallenge}
        />

        {/* All Timelines */}
        <AllTimelines
          game={gameState}
          currentPlayerId={playerId}
          onPlaceCard={handlePlaceCard}
        />

        {/* Token Actions (only for current player) */}
        {isMyTurn && (
          <TokenActions
            player={myPlayer || null}
            isCurrentPlayer={isMyTurn}
            phase={gameState.phase}
            onSkip={handleSkip}
            onFreeCard={handleFreeCard}
          />
        )}

        {/* Manual next turn button (for testing/stuck games) */}
        {gameState.phase === 'REVEAL' && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={nextTurn}>
              Next Turn →
            </Button>
          </div>
        )}
      </div>

      {/* Winner Modal */}
      <WinnerModal game={gameState} onClose={handleReturnHome} />
    </div>
  );
}
