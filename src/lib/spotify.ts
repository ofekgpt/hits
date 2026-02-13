import type { Song } from '@/types/game';

// In-memory token cache
let cachedToken: { access_token: string; expires_at: number } | null = null;

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

// Genre queries to combine with year filters for maximum variety
const GENRE_QUERIES = [
  // International
  'pop', 'rock', 'soul', 'disco', 'hip-hop', 'r&b', 'dance', 'indie',
  'funk', 'reggae', 'metal', 'country', 'jazz', 'blues', 'latin',
  'electronic', 'punk', 'alternative', 'new wave', 'reggaeton',
  // Israeli / Hebrew
  'israeli', 'israeli pop', 'israeli rock',
];

async function fetchTracksForDecade(
  token: string,
  startYear: number,
  endYear: number,
  count: number
): Promise<Song[]> {
  const songs: Song[] = [];
  const seenIds = new Set<string>();

  // Pick random genres to search with for variety across games
  const shuffledGenres = [...GENRE_QUERIES].sort(() => Math.random() - 0.5);

  for (const genre of shuffledGenres) {
    if (songs.length >= count) break;

    // Spotify free-tier apps cap search limit at 10
    const offset = Math.floor(Math.random() * 90);
    const limit = 10;

    const query = encodeURIComponent(`genre:${genre} year:${startYear}-${endYear}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=${limit}&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      continue;
    }

    const data = await response.json();
    const tracks: SpotifyTrack[] = data.tracks?.items ?? [];

    for (const track of tracks) {
      if (songs.length >= count) break;
      if (seenIds.has(track.id)) continue;

      const song = trackToSong(track);
      if (song) {
        seenIds.add(track.id);
        songs.push(song);
      }
    }
  }

  return songs;
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function buildSpotifyDeck(): Promise<Song[]> {
  const token = await getSpotifyToken();

  const decades = [
    { start: 1960, end: 1969 },
    { start: 1970, end: 1979 },
    { start: 1980, end: 1989 },
    { start: 1990, end: 1999 },
    { start: 2000, end: 2009 },
    { start: 2010, end: 2019 },
    { start: 2020, end: 2024 },
  ];

  const tracksPerDecade = 12;

  const results = await Promise.all(
    decades.map((d) => fetchTracksForDecade(token, d.start, d.end, tracksPerDecade))
  );

  const allSongs = results.flat();

  // Deduplicate by spotifyId
  const seen = new Set<string>();
  const unique = allSongs.filter((s) => {
    if (seen.has(s.spotifyId)) return false;
    seen.add(s.spotifyId);
    return true;
  });

  return shuffle(unique);
}
