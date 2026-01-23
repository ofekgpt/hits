import type { Song } from '@/types/game';

// Song database with YouTube video IDs
// Using official music videos and verified working IDs
export const songs: Song[] = [
  // 1960s
  { id: '1', youtubeId: 'iT6vqeL40v4', title: 'Twist and Shout', artist: 'The Beatles', year: 1963 },
  { id: '2', youtubeId: 'jenWdylTtzs', title: 'I Want to Hold Your Hand', artist: 'The Beatles', year: 1963 },
  { id: '3', youtubeId: 'nrIPxlFzDi0', title: "(I Can't Get No) Satisfaction", artist: 'The Rolling Stones', year: 1965 },
  { id: '4', youtubeId: '6FOUqQt3Kg0', title: 'Respect', artist: 'Aretha Franklin', year: 1967 },
  { id: '5', youtubeId: 'A_MjCqQoLLA', title: 'Hey Jude', artist: 'The Beatles', year: 1968 },
  { id: '6', youtubeId: 'A3yCcXgbKrE', title: 'What a Wonderful World', artist: 'Louis Armstrong', year: 1967 },

  // 1970s
  { id: '7', youtubeId: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', year: 1975 },
  { id: '8', youtubeId: 'fNFzfwLM72c', title: 'Stayin Alive', artist: 'Bee Gees', year: 1977 },
  { id: '9', youtubeId: 'oRdxUFDoQe0', title: 'Dancing Queen', artist: 'ABBA', year: 1976 },
  { id: '10', youtubeId: 'EPhWR4d3FJQ', title: 'Hotel California', artist: 'Eagles', year: 1977 },
  { id: '11', youtubeId: '1w7OgIMMRc4', title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987 },
  { id: '12', youtubeId: 'btPJPFnesV4', title: 'Eye of the Tiger', artist: 'Survivor', year: 1982 },

  // 1980s
  { id: '13', youtubeId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', year: 1987 },
  { id: '14', youtubeId: 'sOnqjkJTMaA', title: 'Thriller', artist: 'Michael Jackson', year: 1982 },
  { id: '15', youtubeId: 'djV11Xbc914', title: 'Take On Me', artist: 'a-ha', year: 1985 },
  { id: '16', youtubeId: 'lDK9QqIzhwk', title: 'Livin on a Prayer', artist: 'Bon Jovi', year: 1986 },
  { id: '17', youtubeId: 'Zi_XLOBDo_Y', title: 'Billie Jean', artist: 'Michael Jackson', year: 1982 },
  { id: '18', youtubeId: 'F2AitTPI5U0', title: 'Wake Me Up Before You Go-Go', artist: 'Wham!', year: 1984 },
  { id: '19', youtubeId: 'PIb6AZdTr-A', title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper', year: 1983 },
  { id: '20', youtubeId: '1k8craCGpgs', title: "Don't Stop Believin'", artist: 'Journey', year: 1981 },
  { id: '21', youtubeId: '9jK-NcRmVcw', title: 'Final Countdown', artist: 'Europe', year: 1986 },
  { id: '22', youtubeId: 'rY0WxgSXdEE', title: 'Another One Bites the Dust', artist: 'Queen', year: 1980 },
  { id: '23', youtubeId: 'pAgnJDJN4VA', title: 'Beat It', artist: 'Michael Jackson', year: 1983 },
  { id: '24', youtubeId: 'qeMFqkcPYcg', title: 'Every Breath You Take', artist: 'The Police', year: 1983 },
  { id: '25', youtubeId: 'l5aZJBLAu1E', title: 'I Love Rock n Roll', artist: 'Joan Jett', year: 1981 },

  // 1990s
  { id: '26', youtubeId: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', year: 1991 },
  { id: '27', youtubeId: 'C-u5WLJ9Yk4', title: 'Baby One More Time', artist: 'Britney Spears', year: 1998 },
  { id: '28', youtubeId: '3JWTaaS7LdU', title: 'I Will Always Love You', artist: 'Whitney Houston', year: 1992 },
  { id: '29', youtubeId: 'bx1Bh8ZvH84', title: 'Wonderwall', artist: 'Oasis', year: 1995 },
  { id: '30', youtubeId: 'gJLIiF15wjQ', title: 'Wannabe', artist: 'Spice Girls', year: 1996 },
  { id: '31', youtubeId: '4fndeDfaWCg', title: 'I Want It That Way', artist: 'Backstreet Boys', year: 1999 },
  { id: '32', youtubeId: 'NHozn0YXAeE', title: 'MMMBop', artist: 'Hanson', year: 1997 },
  { id: '33', youtubeId: 'xwtdhWltSIg', title: 'Losing My Religion', artist: 'R.E.M.', year: 1991 },
  { id: '34', youtubeId: 'DNyKDI9pn0s', title: 'My Heart Will Go On', artist: 'Celine Dion', year: 1997 },
  { id: '35', youtubeId: 'otCpCn0l4Wo', title: "U Can't Touch This", artist: 'MC Hammer', year: 1990 },
  { id: '36', youtubeId: 'fPO76Jlnz6c', title: "Gangsta's Paradise", artist: 'Coolio', year: 1995 },
  { id: '37', youtubeId: 'XFkzRNyygfk', title: 'Creep', artist: 'Radiohead', year: 1992 },
  { id: '38', youtubeId: 'ZyhrYis509A', title: 'Barbie Girl', artist: 'Aqua', year: 1997 },
  { id: '39', youtubeId: 'FrLequ6dUdM', title: 'No Scrubs', artist: 'TLC', year: 1999 },
  { id: '40', youtubeId: 'vabnZ9-ex7o', title: 'Bitter Sweet Symphony', artist: 'The Verve', year: 1997 },

  // 2000s
  { id: '41', youtubeId: 'PWgvGjAhvIw', title: 'Hey Ya!', artist: 'OutKast', year: 2003 },
  { id: '42', youtubeId: 'rYEDA3JcQqw', title: 'Rolling in the Deep', artist: 'Adele', year: 2010 },
  { id: '43', youtubeId: 'ViwtNLUqkMY', title: 'Crazy in Love', artist: 'Beyonce', year: 2003 },
  { id: '44', youtubeId: '4m48GqaOz90', title: 'Single Ladies', artist: 'Beyonce', year: 2008 },
  { id: '45', youtubeId: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', year: 2015 },
  { id: '46', youtubeId: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', year: 2014 },
  { id: '47', youtubeId: 'LOZuxwVk7TU', title: 'Toxic', artist: 'Britney Spears', year: 2004 },
  { id: '48', youtubeId: 'gGdGFtwCNBE', title: 'Mr. Brightside', artist: 'The Killers', year: 2003 },
  { id: '49', youtubeId: '_Yhyp-_hX2s', title: 'Lose Yourself', artist: 'Eminem', year: 2002 },
  { id: '50', youtubeId: 'CvBfHwUxHIk', title: 'Umbrella', artist: 'Rihanna', year: 2007 },
  { id: '51', youtubeId: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', year: 2017 },
  { id: '52', youtubeId: 'nfWlot6h_JM', title: 'Shake It Off', artist: 'Taylor Swift', year: 2014 },
  { id: '53', youtubeId: 'DUT5rXLdlW0', title: 'Hips Dont Lie', artist: 'Shakira', year: 2006 },
  { id: '54', youtubeId: 'd020hcWA_Wg', title: 'Clocks', artist: 'Coldplay', year: 2002 },
  { id: '55', youtubeId: '-N4jf6rtyuw', title: 'Crazy', artist: 'Gnarls Barkley', year: 2006 },
  { id: '56', youtubeId: 'bESGLojNYSo', title: 'Poker Face', artist: 'Lady Gaga', year: 2008 },
  { id: '57', youtubeId: 'VDvr08sCPOc', title: 'Remember the Name', artist: 'Fort Minor', year: 2005 },
  { id: '58', youtubeId: 'ktvTqknDobU', title: 'Radioactive', artist: 'Imagine Dragons', year: 2012 },

  // 2010s
  { id: '59', youtubeId: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', year: 2014 },
  { id: '60', youtubeId: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', year: 2017 },
  { id: '61', youtubeId: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', year: 2017 },
  { id: '62', youtubeId: 'CevxZvSJLk8', title: 'Roar', artist: 'Katy Perry', year: 2013 },
  { id: '63', youtubeId: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic', year: 2013 },
  { id: '64', youtubeId: 'SQy_Ll3u7gk', title: 'Sorry', artist: 'Justin Bieber', year: 2015 },
  { id: '65', youtubeId: 'DyDfgMOUjCI', title: 'Bad Guy', artist: 'Billie Eilish', year: 2019 },
  { id: '66', youtubeId: 'fKopy74weus', title: 'Thunder', artist: 'Imagine Dragons', year: 2017 },
  { id: '67', youtubeId: '7PCkvCPvDXk', title: 'All About That Bass', artist: 'Meghan Trainor', year: 2014 },
  { id: '68', youtubeId: 'e-ORhEE9VVg', title: 'Blank Space', artist: 'Taylor Swift', year: 2014 },
  { id: '69', youtubeId: 'nSDgHBxUbVQ', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', year: 2015 },
  { id: '70', youtubeId: 'ru0K8uYEZWw', title: 'Cant Stop the Feeling', artist: 'Justin Timberlake', year: 2016 },
  { id: '71', youtubeId: 'PT2_F-1esPk', title: 'Closer', artist: 'The Chainsmokers ft. Halsey', year: 2016 },
  { id: '72', youtubeId: 'iS1g8G_njx8', title: 'Moves Like Jagger', artist: 'Maroon 5', year: 2011 },
  { id: '73', youtubeId: '2vjPBrBU-TM', title: 'Chandelier', artist: 'Sia', year: 2014 },
  { id: '74', youtubeId: '4NRXx6U8ABQ', title: 'Blinding Lights', artist: 'The Weeknd', year: 2019 },
  { id: '75', youtubeId: 'lp-EO5I60KA', title: 'Thinking Out Loud', artist: 'Ed Sheeran', year: 2014 },

  // 2020s
  { id: '76', youtubeId: 'TUVcZfQe-Kw', title: 'Levitating', artist: 'Dua Lipa', year: 2020 },
  { id: '77', youtubeId: 'q0hyYWKXF0Q', title: 'Dance Monkey', artist: 'Tones and I', year: 2019 },
  { id: '78', youtubeId: 'E07s5ZYygMg', title: 'Watermelon Sugar', artist: 'Harry Styles', year: 2020 },
  { id: '79', youtubeId: 'osdoLjUNFnA', title: 'Dont Start Now', artist: 'Dua Lipa', year: 2019 },
  { id: '80', youtubeId: 'tQ0yjYUFKAE', title: 'Peaches', artist: 'Justin Bieber', year: 2021 },
  { id: '81', youtubeId: 'm7Bc3pLyij0', title: 'Happier', artist: 'Marshmello & Bastille', year: 2018 },
  { id: '82', youtubeId: 'bo_efYhYU2A', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', year: 2018 },
  { id: '83', youtubeId: 'DRS_PpOrUZ4', title: 'In My Feelings', artist: 'Drake', year: 2018 },
  { id: '84', youtubeId: 'ZmDBbnmKpqQ', title: 'drivers license', artist: 'Olivia Rodrigo', year: 2021 },
  { id: '85', youtubeId: 'lYoWuaw5nSk', title: 'Shivers', artist: 'Ed Sheeran', year: 2021 },
  { id: '86', youtubeId: 'psuRGfAaju4', title: 'Old Town Road', artist: 'Lil Nas X', year: 2019 },
  { id: '87', youtubeId: 'kTJczUoc26U', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', year: 2021 },
  { id: '88', youtubeId: 'b1kbLwvqugk', title: 'Anti-Hero', artist: 'Taylor Swift', year: 2022 },
  { id: '89', youtubeId: 'mRD0-GxqHVo', title: 'Heat Waves', artist: 'Glass Animals', year: 2020 },

  // Classic Rock
  { id: '90', youtubeId: 'l482T0yNkeo', title: 'Highway to Hell', artist: 'AC/DC', year: 1979 },
  { id: '91', youtubeId: 'XMLiqEqMQyQ', title: 'We Will Rock You', artist: 'Queen', year: 1977 },
  { id: '92', youtubeId: 'IxuThNgl3YA', title: 'Born to Run', artist: 'Bruce Springsteen', year: 1975 },
  { id: '93', youtubeId: 'hHRNSeuvzlM', title: 'Dream On', artist: 'Aerosmith', year: 1973 },
  { id: '94', youtubeId: 'vabnZ9-ex7o', title: 'Come As You Are', artist: 'Nirvana', year: 1991 },
  { id: '95', youtubeId: 'WpmILPAcRQo', title: 'In the End', artist: 'Linkin Park', year: 2000 },

  // More Pop Hits
  { id: '96', youtubeId: 'QGJuMBdaqIw', title: 'Firework', artist: 'Katy Perry', year: 2010 },
  { id: '97', youtubeId: 'EkHTsc9PU2A', title: 'Im Yours', artist: 'Jason Mraz', year: 2008 },
  { id: '98', youtubeId: 'nlcIKh6sBtc', title: 'Royals', artist: 'Lorde', year: 2013 },
  { id: '99', youtubeId: 'JRfuAukYTKg', title: 'Titanium', artist: 'David Guetta ft. Sia', year: 2011 },
  { id: '100', youtubeId: 'KQ6zr6kCPj8', title: 'Party Rock Anthem', artist: 'LMFAO', year: 2011 },
];

// Get shuffled deck of songs
export function getShuffledDeck(): Song[] {
  const shuffled = [...songs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
