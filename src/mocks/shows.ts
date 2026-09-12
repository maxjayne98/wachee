import type { Show } from '@/types'

export function createMockShow(overrides: Partial<Show> = {}): Show {
  return {
    id: 1,
    name: 'Severance',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    status: 'Running',
    runtime: 55,
    averageRuntime: 55,
    premiered: '2022-02-18',
    ended: null,
    officialSite: 'https://tv.apple.com/show/severance',
    schedule: { time: '00:00', days: ['Friday'] },
    rating: { average: 8.7 },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/403/1009946.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/403/1009946.jpg',
    },
    summary:
      '<p>Mark Scout leads a team at Lumon Industries, whose employees have undergone a severance procedure.</p>',
    url: 'https://www.tvmaze.com/shows/44813/severance',
    network: null,
    webChannel: { id: 310, name: 'Apple TV+' },
    externals: { imdb: 'tt11280740', thetvdb: 371980, tvrage: null },
    ...overrides,
  }
}

export const mockShowsList: Show[] = [
  createMockShow({
    id: 1,
    name: 'Breaking Bad',
    language: 'English',
    genres: ['Drama', 'Crime', 'Thriller'],
    runtime: 47,
    rating: { average: 9.5 },
  }),
  createMockShow({
    id: 2,
    name: 'Dark',
    language: 'German',
    genres: ['Drama', 'Sci-Fi', 'Mystery'],
    runtime: 60,
    rating: { average: 8.9 },
  }),
  createMockShow({
    id: 3,
    name: 'The Office',
    language: 'English',
    genres: ['Comedy'],
    runtime: 22,
    rating: { average: 8.8 },
  }),
  createMockShow({
    id: 4,
    name: 'The Worst Show Ever!',
    language: 'English',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    runtime: 40,
    rating: { average: 1.0 },
  }),
  createMockShow({
    id: 5,
    name: 'Money Heist',
    language: 'Spanish',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 50,
    rating: { average: 8.2 },
  }),
  createMockShow({
    id: 6,
    name: 'The Best Show in The World',
    language: 'English',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    runtime: 40,
    rating: { average: 9.0 },
  }),
  createMockShow({
    id: 7,
    name: 'Arcane',
    language: 'English',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    runtime: 40,
    rating: { average: 9.0 },
  }),
]
