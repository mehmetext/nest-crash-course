// Type representing a single trending TV show item
interface TrendingTvItem {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: 'tv';
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

// Type representing the trending TV response structure
interface TrendingTvResponse {
  page: number;
  results: TrendingTvItem[];
  total_pages: number;
  total_results: number;
}
