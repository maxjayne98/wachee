export interface ImageInfo {
  medium?: string
  original?: string
}

export interface RatingInfo {
  average?: number | null
}

export interface ScheduleInfo {
  time: string
  days: string[]
}

export interface ExternalsInfo {
  tvrage?: number | null
  thetvdb?: number | null
  imdb?: string | null
}

export interface NetworkInfo {
  id: number
  name: string
  country?: {
    name: string
    code: string
    timezone: string
  }
}

export interface Show {
  id: number
  name: string
  genres: string[]
  type: string
  language?: string
  runtime?: number | null
  premiered?: string | null
  ended?: string | null
  schedule: ScheduleInfo
  rating: RatingInfo
  image?: ImageInfo | null
  summary?: string | null
  url: string
  officialSite?: string | null
  status: string
  network?: NetworkInfo | null
  webChannel?: { id: number; name: string } | null
  averageRuntime?: number | null
  externals?: ExternalsInfo
}

export interface SearchResult {
  score: number
  show: Show
}

export interface CastMember {
  person: {
    id: number
    name: string
    image?: ImageInfo | null
  }
  character: {
    id: number
    name: string
    image?: ImageInfo | null
  } | null
  self?: boolean
  voice?: boolean
}

export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? K | `${K}.${NestedKeyOf<T[K]>}` : K
    }[keyof T & string]
  : never

export interface Season {
  id: number
  number: number
  name: string
  premiereDate: string | null
  endDate: string | null
  episodeOrder: number | null
}

export interface Episode {
  id: number
  name: string
  url: string
  season: number
  number: number | null
  airdate: string
  runtime: number | null
  image: ImageInfo | null
  summary: string | null
}

export interface ShowImage {
  id: number
  type: string | null
  main: boolean
  resolutions: { original: { url: string }; medium?: { url: string } }
}
