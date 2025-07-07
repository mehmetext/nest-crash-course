// Type representing a single trending movie item
interface TrendingMovie {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  media_type: 'movie';
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Type representing the trending movies API response
interface TrendingMoviesResponse {
  page: number;
  results: TrendingMovie[];
  total_pages: number;
  total_results: number;
}
