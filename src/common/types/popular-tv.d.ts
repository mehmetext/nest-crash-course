// Type representing a single popular TV show item
interface PopularTv {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string; // ISO date string (e.g., "2021-09-17")
  name: string;
  vote_average: number;
  vote_count: number;
}

// Type representing the response for popular TV shows
interface PopularTvResponse {
  page: number;
  results: PopularTv[];
  total_pages: number;
  total_results: number;
}
