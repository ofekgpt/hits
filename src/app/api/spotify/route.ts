import { NextResponse } from 'next/server';
import { buildSpotifyDeck, getSpotifyToken, trackToSong } from '@/lib/spotify';
import type { Song } from '@/types/game';

interface SpotifyTrackResult {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'build-deck') {
      const deck = await buildSpotifyDeck();
      return NextResponse.json({ tracks: deck, count: deck.length });
    }

    if (action === 'search') {
      const query = searchParams.get('q');
      if (!query) {
        return NextResponse.json(
          { error: 'Missing query parameter' },
          { status: 400 }
        );
      }

      const token = await getSpotifyToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10&market=US`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify search failed: ${response.status}`);
      }

      const data = await response.json();
      const tracks: Song[] = (data.tracks?.items ?? [])
        .map((t: SpotifyTrackResult) => trackToSong(t))
        .filter(Boolean) as Song[];

      return NextResponse.json({ tracks });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { error: 'Spotify API failed' },
      { status: 500 }
    );
  }
}
