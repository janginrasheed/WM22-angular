export interface News {
  status: string;
  totalResults: number;
  results?: ResultsEntity[] | null;
  nextPage: number;
}

export interface ResultsEntity {
  title: string;
  link: string;
  keywords?: string[] | null;
  creator?: string[] | null;
  video_url?: null;
  description: string;
  content?: string | null;
  pubDate: string;
  image_url?: string | null;
  source_id: string;
  country?: string[] | null;
  category?: string[] | null;
  language: string;
}
