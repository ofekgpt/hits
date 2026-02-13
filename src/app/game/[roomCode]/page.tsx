'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useGameActions } from '@/hooks/useGameActions';
import { GameHeader } from '@/components/game/GameHeader';
import { Timeline } from '@/components/game/Timeline';
import { SongCard } from '@/components/game/SongCard';
import { AudioPlayer } from '@/components/game/AudioPlayer';
import { TokenActions } from '@/components/game/TokenActions';
import { ChallengeButton } from '@/components/game/ChallengeButton';
import { WinnerModal } from '@/components/game/WinnerModal';
import { Button } from '@/components/ui/Button';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

  const { socket, gameState, isConnected, leaveRoom } = useSocket(roomCode, mounted ? playerId : null);
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

  const handleLeaveRoom = () => {
    leaveRoom(roomCode);
    localStorage.removeItem('playerId');
    router.push('/');
  };

  if (!mounted || !playerId || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted font-display text-lg">
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
    <div className="min-h-screen flex flex-col pb-[140px]">
      {/* Header */}
      <div className="p-3">
        <GameHeader game={gameState} currentPlayerId={playerId} onLeaveRoom={handleLeaveRoom} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
        {/* Current Card Area */}
        <div className="flex flex-col items-center">
          {gameState.phase === 'PLAYING_SONG' && !gameState.currentCard && amDj ? (
            <div className="glass-panel rounded-2xl p-6 text-center w-full">
              <Button onClick={playSong} className="w-full" size="lg">
                Draw & Play Next Song
              </Button>
            </div>
          ) : gameState.phase === 'PLAYING_SONG' && gameState.currentCard ? (
            amDj ? (
              <div className="glass-panel rounded-2xl p-6 w-full space-y-4">
                <div className="flex justify-center">
                  <SongCard card={gameState.currentCard} faceUp={false} size="lg" />
                </div>
                <p className="text-text-muted text-sm text-center">Song is playing below</p>
                <Button onClick={songPlayed} className="w-full">
                  Song Played — Let Player Guess
                </Button>
                <Button variant="ghost" size="sm" onClick={skipSong} className="w-full">
                  Skip Song (broken audio)
                </Button>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-8 text-center w-full">
                <div className="flex justify-center mb-4">
                  <SongCard card={gameState.currentCard} faceUp={false} size="lg" />
                </div>
                <p className="text-text-muted text-sm">
                  <span className="text-neon-magenta font-display font-bold">{currentDj?.name}</span> is playing a song...
                </p>
              </div>
            )
          ) : gameState.currentCard ? (
            <div className="flex justify-center">
              <SongCard
                card={gameState.currentCard}
                faceUp={gameState.phase === 'REVEAL' || gameState.phase === 'RESULT'}
                size="lg"
              />
            </div>
          ) : null}
        </div>

        {/* Challenge Button */}
        <ChallengeButton
          game={gameState}
          currentPlayerId={playerId}
          onChallenge={handleChallenge}
        />

        {/* All Timelines */}
        <div className="space-y-3">
          {gameState.players.map((player, index) => (
            <Timeline
              key={player.id}
              player={player}
              isCurrentPlayer={index === gameState.currentPlayerIndex}
              isDj={index === gameState.currentDjIndex}
              isMe={player.id === playerId}
              showPlacementSlots={
                gameState.phase === 'PLACING_CARD' &&
                isMyTurn &&
                player.id === playerId
              }
              onPlaceCard={
                gameState.phase === 'PLACING_CARD' && isMyTurn && player.id === playerId
                  ? handlePlaceCard
                  : undefined
              }
            />
          ))}
        </div>

        {/* Token Actions */}
        {isMyTurn && (
          <TokenActions
            player={myPlayer || null}
            isCurrentPlayer={isMyTurn}
            phase={gameState.phase}
            onSkip={handleSkip}
            onFreeCard={handleFreeCard}
          />
        )}

        {/* Manual next turn */}
        {gameState.phase === 'REVEAL' && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={nextTurn}>
              Next Turn →
            </Button>
          </div>
        )}
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentCard={gameState.currentCard}
        isPlaying={gameState.phase === 'PLAYING_SONG'}
      />

      {/* Winner Modal */}
      <WinnerModal game={gameState} onClose={handleReturnHome} />
    </div>
  );
}
