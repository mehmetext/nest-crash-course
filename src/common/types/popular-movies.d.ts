// Type representing a single popular movie item
interface PopularMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string; // ISO date string (e.g., "2025-06-04")
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Type representing the response for popular movies
interface PopularMoviesResponse {
  page: number;
  results: PopularMovie[];
  total_pages: number;
  total_results: number;
}
