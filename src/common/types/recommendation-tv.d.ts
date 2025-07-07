interface RecommendationTv {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string; // TV shows use 'name' instead of 'title'
  original_name: string; // TV shows use 'original_name' instead of 'original_title'
  overview: string;
  poster_path: string;
  media_type: string; // Added media_type field
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string; // TV shows use 'first_air_date' instead of 'release_date'
  vote_average: number;
  vote_count: number;
  origin_country: string[]; // Added origin_country field for TV shows
}

interface RecommendationTvResponse {
  page: number;
  results: RecommendationTv[];
  total_pages: number;
  total_results: number;
}
