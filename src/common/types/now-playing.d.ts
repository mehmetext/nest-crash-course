// Type representing a single now playing movie item
interface NowPlayingMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Type representing the date range for now playing movies
interface NowPlayingDates {
  maximum: string;
  minimum: string;
}

// Type representing the now playing movies API response
interface NowPlayingMoviesResponse {
  dates: NowPlayingDates;
  page: number;
  results: NowPlayingMovie[];
  total_pages: number;
  total_results: number;
}
