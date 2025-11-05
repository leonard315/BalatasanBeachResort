'use client';
import {
  collection,
  query,
  where,
  doc,
  type CollectionReference,
  type DocumentReference,
  type Query,
  collectionGroup,
} from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import type {
  Accommodation,
  Tour,
  Booking,
  Review,
  WaterSport,
  User,
} from './types';

// --- Data Fetching Hooks ---

export function useAccommodations() {
  const firestore = useFirestore();
  const accommodationsCollection = useMemoFirebase(
    () => collection(firestore, 'accommodations') as CollectionReference<Accommodation>,
    [firestore]
  );
  return useCollection<Accommodation>(accommodationsCollection);
}

export function useAccommodationById(id: string | null | undefined) {
    const firestore = useFirestore();
    const accommodationDoc = useMemoFirebase(
        () => (id ? doc(firestore, 'accommodations', id) as DocumentReference<Accommodation> : null),
        [firestore, id]
    );
    return useDoc<Accommodation>(accommodationDoc);
}

export function useTours() {
  const firestore = useFirestore();
  const toursCollection = useMemoFirebase(
    () => collection(firestore, 'tourPackages') as CollectionReference<Tour>,
    [firestore]
  );
  return useCollection<Tour>(toursCollection);
}

export function useUserBookings() {
    const firestore = useFirestore();
    const { user } = useUser();
    const bookingsCollection = useMemoFirebase(
        () =>
            user
                ? (collection(
                    firestore,
                    'users',
                    user.uid,
                    'bookings'
                  ) as CollectionReference<Booking>)
                : null,
        [firestore, user]
    );
    return useCollection<Booking>(bookingsCollection);
}

export function useAllBookings() {
    const firestore = useFirestore();
    const bookingsQuery = useMemoFirebase(
        () => collectionGroup(firestore, 'bookings') as Query<Booking>,
        [firestore]
    );
    return useCollection<Booking>(bookingsQuery);
}

export function useUserById(userId: string | null) {
    const firestore = useFirestore();
    const userDoc = useMemoFirebase(
        () => (userId ? doc(firestore, 'users', userId) as DocumentReference<User> : null),
        [firestore, userId]
    );
    return useDoc<User>(userDoc);
}


export function useReviewsByItemId(itemId: string | null) {
    const firestore = useFirestore();
    const reviewsQuery = useMemoFirebase(
        () =>
            itemId
                ? query(
                    collection(firestore, 'reviews'),
                    where('itemId', '==', itemId)
                  )
                : null,
        [firestore, itemId]
    );
    return useCollection<Review>(reviewsQuery as Query<Review> | null);
}

// --- Static Data (To be removed or used for seeding) ---

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
    description:
      'An out-of-this-world ride that will have you bouncing on the water.',
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
    description:
      'Perfect for a solo paddle or a fun race with a friend. Also known as kayaking.',
    duration: '1 hour',
    price: 200,
    images: ['watersport-hand-paddle'],
  },
];

export const getWaterSports = (): WaterSport[] => waterSports;

// Mock data functions to be phased out
const accommodations: Accommodation[] = [
  {
    id: 'floating-cottage-family',
    name: 'Family Floating Cottage',
    description: 'Our largest floating cottage, perfect for families. Offers stunning 360-degree views of the sea and direct water access.',
    type: 'floating_cottage',
    capacity: 6,
    price_per_night: 2500.00,
    amenities: ['2 Bedrooms', 'Kitchenette', 'Sun deck', 'Direct water access', 'Fan-cooled'],
    images: ['floating-cottage-1'],
    rating: 4.7,
    reviews: 42
  },
   {
    id: 'floating-cottage-standard',
    name: 'Standard Floating Cottage',
    description: 'A comfortable floating cottage for small groups or couples, providing a unique on-the-water experience.',
    type: 'floating_cottage',
    capacity: 4,
    price_per_night: 2000.00,
    amenities: ['1 Bedroom', 'Seating Area', 'Sun deck', 'Direct water access', 'Fan-cooled'],
    images: ['floating-cottage-1'],
    rating: 4.6,
    reviews: 35
  },
];

const bookings: Booking[] = [];

const reviews: Review[] = [];

export const getAccommodations = (): Accommodation[] => accommodations;
export const getAccommodationById = (id: string): Accommodation | undefined => accommodations.find(item => item.id === id);
export const getTours = (): Tour[] => {
    // This is now empty, the data lives in the tours page.
    return [];
};
export const getBookings = (): Booking[] => bookings;
export const getReviewsByItemId = (itemId: string): Review[] => reviews.filter(review => review.item_id === itemId);
