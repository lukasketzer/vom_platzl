export interface Review {
  author_name: string;
  text: string;
  rating?: number | null;
  relative_time_description?: string | null;
  profile_photo_url?: string | null;
}

export interface OpeningHours {
  openNow?: boolean;
  periods?: any[];
  weekdayDescriptions?: string[];
}

export interface Place {
  name: string;
  type: string;
  lat: number;
  lon: number;
  tags: Record<string, any>;
  image_url?: string | null;
  rating?: number | null;
  user_ratings_total?: number | null;
  opening_hours: OpeningHours;
  reviews: Review[];
  google_maps_url?: string | null;
  website?: string | null;
  distance: string;
  duration?: string;
}
