import type { Accommodation, Tour, Booking, Review, WaterSport } from './types';

const accommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Beachfront Cottage A',
    description: 'Spacious cottage with ocean view, private porch, and beach access. Perfect for a small family or a couple looking for a romantic getaway.',
    type: 'cottage',
    capacity: 4,
    price_per_night: 2500.00,
    amenities: ['Air conditioning', 'Private bathroom', 'WiFi', 'Kitchenette', 'Beach access', 'Ocean view porch'],
    images: ['cottage-a-1', 'cottage-a-2', 'cottage-a-3'],
    rating: 4.5,
    reviews: 120
  },
  {
    id: '2',
    name: 'Glamping Tent Premium',
    description: 'Luxury glamping experience with comfortable beds and stunning views of the ocean. Embrace nature without sacrificing comfort.',
    type: 'glamping_tent',
    capacity: 2,
    price_per_night: 1800.00,
    amenities: ['Queen bed', 'Electric Fan', 'Shared bathroom', 'Beach view', 'Breakfast included', 'Outdoor seating'],
    images: ['glamping-1', 'glamping-2'],
    rating: 4.8,
    reviews: 95
  },
  {
    id: '3',
    name: 'Family Villa',
    description: 'Large villa perfect for families or groups with 3 bedrooms and full amenities for a comfortable and memorable stay.',
    type: 'villa',
    capacity: 8,
    price_per_night: 5000.00,
    amenities: ['3 Bedrooms', '2 Bathrooms', 'Full Kitchen', 'Living room', 'Private Terrace', 'WiFi', 'AC'],
    images: ['villa-1', 'villa-2', 'villa-3'],
    rating: 4.9,
    reviews: 78
  }
];

const tours: Tour[] = [
  {
    id: '1',
    tour_name: 'Island Hopping Adventure',
    description: 'Visit 3 beautiful islands with snorkeling stops. Enjoy a freshly prepared lunch on a secluded beach.',
    tour_type: 'island_hopping',
    duration_hours: 6,
    price_per_person: 1200.00,
    max_participants: 15,
    inclusions: ['Boat rental', 'Life jackets', 'Snorkeling gear', 'Lunch', 'Tour guide', 'Refreshments'],
    images: ['island-hopping-1', 'island-hopping-2'],
    rating: 4.9,
    reviews: 215
  },
  {
    id: '2',
    tour_name: 'Waterfall Trekking',
    description: 'Guided trek to a hidden waterfall with opportunities for swimming in the cool, refreshing water.',
    tour_type: 'waterfall',
    duration_hours: 4,
    price_per_person: 800.00,
    max_participants: 10,
    inclusions: ['Tour guide', 'Entrance fees', 'Snacks', 'Safety equipment', 'Bottled water'],
    images: ['waterfall-1', 'waterfall-2'],
    rating: 4.7,
    reviews: 150
  },
  {
    id: '3',
    tour_name: 'Snorkeling Experience',
    description: 'Explore vibrant coral reefs and diverse marine life at two of the best local snorkeling spots.',
    tour_type: 'snorkeling',
    duration_hours: 3,
    price_per_person: 600.00,
    max_participants: 12,
    inclusions: ['Snorkeling gear', 'Life jacket', 'Guide', 'Refreshments'],
    images: ['snorkeling-1', 'snorkeling-2'],
    rating: 4.6,
    reviews: 180
  }
];

const bookings: Booking[] = [
    {
        booking_id: 'bk_001',
        booking_reference: 'BBRH-8A4B2',
        item_name: 'Beachfront Cottage A',
        item_image: 'cottage-a-1',
        check_in_date: '2024-08-15',
        check_out_date: '2024-08-18',
        number_of_guests: 2,
        total_amount: 7500.00,
        booking_status: 'confirmed',
    },
    {
        booking_id: 'bk_002',
        booking_reference: 'BBRH-9C1D3',
        item_name: 'Island Hopping Adventure',
        item_image: 'island-hopping-1',
        check_in_date: '2024-07-20',
        check_out_date: null,
        number_of_guests: 4,
        total_amount: 4800.00,
        booking_status: 'completed',
    },
    {
        booking_id: 'bk_003',
        booking_reference: 'BBRH-E5F6G',
        item_name: 'Family Villa',
        item_image: 'villa-1',
        check_in_date: '2024-09-01',
        check_out_date: '2024-09-05',
        number_of_guests: 6,
        total_amount: 20000.00,
        booking_status: 'pending',
    },
    {
        booking_id: 'bk_004',
        booking_reference: 'BBRH-H7I8J',
        item_name: 'Glamping Tent Premium',
        item_image: 'glamping-1',
        check_in_date: '2024-06-10',
        check_out_date: '2024-06-12',
        number_of_guests: 2,
        total_amount: 3600.00,
        booking_status: 'cancelled',
    }
];

const reviews: Review[] = [
    {
        review_id: 'rev_001',
        item_id: '1',
        user_name: 'Jane Doe',
        user_avatar: 'user-avatar-1',
        rating: 5,
        title: 'Absolutely breathtaking!',
        comment: 'The view from our cottage was stunning. Waking up to the sound of waves was a dream. The staff were incredibly friendly and helpful. Highly recommend!',
        created_at: '2 weeks ago',
    },
    {
        review_id: 'rev_002',
        item_id: '1',
        user_name: 'John Smith',
        user_avatar: 'user-avatar-2',
        rating: 4,
        title: 'Great location, cozy cottage',
        comment: 'A fantastic location right on the beach. The cottage was clean and had everything we needed. Wi-Fi was a bit spotty, but who needs it with a view like that? Would visit again.',
        created_at: '1 month ago',
    }
];

const waterSports: WaterSport[] = [
  {
    id: 'ws-1',
    name: 'Flying Fish',
    description: 'A thrilling ride that sends you flying over the waves.',
    capacity: 3,
    duration: '15 mins',
    basePrice: 1500,
    excess: 500,
    images: ['watersport-flying-fish'],
  },
  {
    id: 'ws-2',
    name: 'Banana Boat',
    description: 'A classic and fun-filled ride for the whole family.',
    capacity: 12,
    duration: '15 mins',
    basePrice: 3000,
    excess: 250,
    images: ['watersport-banana-boat'],
  },
  {
    id: 'ws-3',
    name: 'Hurricane',
    description: 'Get ready to spin and scream on this exhilarating water ride.',
    capacity: 6,
    duration: '15 mins',
    basePrice: 2000,
    excess: 350,
    images: ['watersport-hurricane'],
  },
  {
    id: 'ws-4',
    name: 'Crazy UFO',
    description: 'An out-of-this-world ride that will have you bouncing on the water.',
    capacity: 6,
    duration: '15 mins',
    basePrice: 2000,
    excess: 350,
    images: ['watersport-ufo'],
  },
  {
    id: 'ws-5',
    name: 'Pedal Boat',
    description: 'A relaxing way to explore the calm waters at your own pace.',
    capacity: 4,
    duration: '1 hour',
    price: 500,
    images: ['watersport-pedal-boat'],
  },
  {
    id: 'ws-6',
    name: 'Hand Paddle Boat',
    description: 'Perfect for a solo paddle or a fun race with a friend.',
    duration: '1 hour',
    price: 200,
    images: ['watersport-hand-paddle'],
  },
];


export const getAccommodations = (): Accommodation[] => accommodations;
export const getAccommodationById = (id: string): Accommodation | undefined => accommodations.find(item => item.id === id);

export const getTours = (): Tour[] => tours;
export const getTourById = (id: string): Tour | undefined => tours.find(item => item.id === id);

export const getBookings = (): Booking[] => bookings;

export const getReviewsByItemId = (itemId: string): Review[] => reviews.filter(review => review.item_id === itemId);

export const getWaterSports = (): WaterSport[] => waterSports;
