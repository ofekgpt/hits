import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRoomCode } from '@/lib/utils/shuffle';
import { getShuffledDeck } from '@/data/songs';
import { PLAYER_COLORS } from '@/types/game';

// POST /api/games - Create a new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, gameMode = 'ORIGINAL' } = body;

    if (!playerName || playerName.trim().length === 0) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    // Generate unique room code
    let roomCode: string;
    let attempts = 0;
    do {
      roomCode = generateRoomCode();
      const existing = await prisma.game.findUnique({ where: { roomCode } });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      return NextResponse.json({ error: 'Failed to generate room code' }, { status: 500 });
    }

    // Get shuffled deck
    const deck = getShuffledDeck();

    // Create game with host player
    const game = await prisma.game.create({
      data: {
        roomCode,
        gameMode,
        deck: JSON.stringify(deck),
        players: {
          create: {
            name: playerName.trim(),
            color: PLAYER_COLORS[0],
            isHost: true,
          },
        },
      },
      include: {
        players: true,
      },
    });

    // Update hostPlayerId
    await prisma.game.update({
      where: { id: game.id },
      data: { hostPlayerId: game.players[0].id },
    });

    return NextResponse.json({
      game: {
        ...game,
        hostPlayerId: game.players[0].id,
      },
      player: game.players[0],
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}

// GET /api/games?roomCode=XXXX - Get game by room code
export async function GET(request: NextRequest) {
  try {
    const roomCode = request.nextUrl.searchParams.get('roomCode');

    if (!roomCode) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        players: {
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error getting game:', error);
    return NextResponse.json({ error: 'Failed to get game' }, { status: 500 });
  }
}
