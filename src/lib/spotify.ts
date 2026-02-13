import type { Song } from '@/types/game';

// In-memory token cache
let cachedToken: { access_token: string; expires_at: number } | null = null;

// In-memory song pool cache — avoids rebuilding every game
let cachedPool: { songs: Song[]; builtAt: number } | null = null;
const POOL_TTL = 1000 * 60 * 30; // Refresh pool every 30 minutes

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables. ' +
      'Add them in Vercel Dashboard > Project Settings > Environment Variables.'
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status}`);
  }

  const data = await response.json();

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + 3500 * 1000,
  };

  return data.access_token;
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: {
    release_date: string;
    release_date_precision: string;
    images: { url: string; width: number; height: number }[];
  };
}

export function trackToSong(track: SpotifyTrack): Song | null {
  const yearStr = track.album.release_date?.substring(0, 4);
  const year = parseInt(yearStr, 10);

  if (!year || isNaN(year) || year < 1950 || year > 2026) {
    return null;
  }

  const albumArt = track.album.images?.[0]?.url ?? null;
  if (!albumArt) {
    return null;
  }

  return {
    id: track.id,
    spotifyId: track.id,
    title: track.name,
    artist: track.artists[0]?.name ?? 'Unknown',
    year,
    albumArt,
    spotifyUri: track.uri,
  };
}

// International genres
const INTL_GENRES = [
  'pop', 'rock', 'soul', 'disco', 'hip-hop', 'r&b', 'dance', 'indie',
  'funk', 'reggae', 'metal', 'country', 'jazz', 'blues', 'latin',
  'electronic', 'punk', 'alternative', 'new wave', 'reggaeton',
  'classical', 'folk', 'gospel', 'ska', 'swing',
];

// Israeli / Hebrew genres
const HEBREW_GENRES = [
  'israeli', 'israeli pop', 'israeli rock', 'israeli hip hop',
  'israeli jazz', 'israeli folk', 'mizrahi',
];

const ALL_GENRES = [...INTL_GENRES, ...HEBREW_GENRES];

const DECADES = [
  { start: 1960, end: 1969 },
  { start: 1970, end: 1979 },
  { start: 1980, end: 1989 },
  { start: 1990, end: 1999 },
  { start: 2000, end: 2009 },
  { start: 2010, end: 2019 },
  { start: 2020, end: 2026 },
];

/**
 * Fetch a single page of tracks from Spotify search.
 * Spotify free-tier caps limit at 10.
 */
async function fetchPage(
  token: string,
  genre: string,
  startYear: number,
  endYear: number,
  offset: number
): Promise<Song[]> {
  const query = encodeURIComponent(`genre:${genre} year:${startYear}-${endYear}`);
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const tracks: SpotifyTrack[] = data.tracks?.items ?? [];

  const songs: Song[] = [];
  for (const track of tracks) {
    const song = trackToSong(track);
    if (song) {
      songs.push(song);
    }
  }

  return songs;
}

/**
 * Build the full song pool by querying every genre × decade × multiple offsets.
 * Runs queries in parallel batches to stay fast while maximizing coverage.
 */
async function buildSongPool(token: string): Promise<Song[]> {
  const seenIds = new Set<string>();
  const allSongs: Song[] = [];

  // Build all query combinations: genre × decade × offsets
  const queries: { genre: string; start: number; end: number; offset: number }[] = [];

  for (const genre of ALL_GENRES) {
    for (const decade of DECADES) {
      // Multiple offsets per genre-decade to pull more tracks
      const offsets = [0, 10, 20, 40, 60, 80];
      for (const offset of offsets) {
        queries.push({ genre, start: decade.start, end: decade.end, offset });
      }
    }
  }

  // Shuffle queries so we get variety even if we hit rate limits
  for (let i = queries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queries[i], queries[j]] = [queries[j], queries[i]];
  }

  // Execute in parallel batches of 15 to avoid rate limiting
  const BATCH_SIZE = 15;
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((q) => fetchPage(token, q.genre, q.start, q.end, q.offset))
    );

    for (const songs of results) {
      for (const song of songs) {
        if (!seenIds.has(song.spotifyId)) {
          seenIds.add(song.spotifyId);
          allSongs.push(song);
        }
      }
    }
  }

  return allSongs;
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Build a game deck by selecting tracks from the song pool.
 * The pool is cached for 30 minutes to keep game creation fast.
 * Each game gets a different random selection from the pool.
 */
export async function buildSpotifyDeck(): Promise<Song[]> {
  const token = await getSpotifyToken();

  // Build or reuse cached pool
  if (!cachedPool || Date.now() - cachedPool.builtAt > POOL_TTL) {
    const pool = await buildSongPool(token);
    cachedPool = { songs: pool, builtAt: Date.now() };
  }

  const pool = cachedPool.songs;

  if (pool.length === 0) {
    return [];
  }

  // Shuffle the entire pool and pick a game-sized deck
  // Aim for ~10 songs per decade, balanced across decades
  const byDecade = new Map<string, Song[]>();
  for (const song of shuffle(pool)) {
    const decadeKey = `${Math.floor(song.year / 10) * 10}s`;
    const existing = byDecade.get(decadeKey) || [];
    existing.push(song);
    byDecade.set(decadeKey, existing);
  }

  // Pick up to 15 songs per decade for the game deck
  const deck: Song[] = [];
  for (const [, songs] of byDecade) {
    deck.push(...songs.slice(0, 15));
  }

  return shuffle(deck);
}
