interface RecommendationMovies {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  video: boolean;
}

interface RecommendationMoviesResponse {
  page: number;
  results: RecommendationMovies[];
  total_pages: number;
  total_results: number;
}
