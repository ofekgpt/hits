-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "hostPlayerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "gameMode" TEXT NOT NULL DEFAULT 'ORIGINAL',
    "currentPlayerIndex" INTEGER NOT NULL DEFAULT 0,
    "currentDjIndex" INTEGER NOT NULL DEFAULT 0,
    "currentCard" TEXT,
    "phase" TEXT NOT NULL DEFAULT 'LOBBY',
    "deck" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 2,
    "timeline" TEXT NOT NULL DEFAULT '[]',
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_roomCode_key" ON "Game"("roomCode");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
