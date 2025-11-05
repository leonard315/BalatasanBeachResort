export interface Accommodation {
  id: string;
  name: string;
  description: string;
  type: 'cottage' | 'glamping_tent' | 'villa' | 'room';
  capacity: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviews: number;
}

export interface Tour {
  id: string;
  tour_name: string;
  description: string;
  tour_type: 'island_hopping' | 'snorkeling' | 'waterfall' | 'cultural' | 'diving';
  duration_hours: number;
  price_per_person: number;
  max_participants: number;
  inclusions: string[];
  images: string[];
  rating: number;
  reviews: number;
}

export interface Booking {
  booking_id: string;
  booking_reference: string;
  item_name: string;
  item_image: string;
  check_in_date: string;
  check_out_date: string | null;
  number_of_guests: number;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
}

export interface Review {
    review_id: string;
    item_id: string;
    user_name: string;
    user_avatar: string;
    rating: number;
    title: string;
    comment: string;
    created_at: string;
}

export interface WaterSport {
  id: string;
  name: string;
  description: string;
  capacity?: number;
  duration: string;
  basePrice?: number;
  excess?: number;
  price?: number;
  images: string[];
}
