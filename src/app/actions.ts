'use server';

import { moderateReview as moderateReviewFlow } from '@/ai/flows/review-moderation-and-suggestions';
import { z } from 'zod';
import type { ModerateReviewOutput } from '@/ai/flows/review-moderation-and-suggestions';
import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { initializeFirebase } from '@/firebase';
import { auth } from 'firebase-admin';
import { getWaterSports, getTours, getAccommodations } from '@/lib/data';

const ReviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required.').max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters long.'),
  itemId: z.string(),
  itemType: z.enum(['accommodation', 'tour']),
});

export type ReviewState = {
  errors?: {
    rating?: string[];
    reviewText?: string[];
  };
  message?: string | null;
  aiResponse?: ModerateReviewOutput | null;
  success?: boolean;
};

export async function submitReview(
  prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const validatedFields = ReviewSchema.safeParse({
    rating: formData.get('rating'),
    reviewText: formData.get('reviewText'),
    itemId: formData.get('itemId'),
    itemType: formData.get('itemType'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to submit review. Please check the fields.',
      success: false,
    };
  }

  try {
    const aiResponse = await moderateReviewFlow(validatedFields.data);

    // In a real application, you would now save the `aiResponse.revisedReviewText`
    // and other details to your database.
    // For this demo, we'll just simulate success.

    revalidatePath(`/accommodations/${validatedFields.data.itemId}`);

    return {
      message:
        'Thank you for your review! It has been submitted for moderation.',
      aiResponse,
      success: true,
    };
  } catch (error) {
    console.error('Review submission error:', error);
    return {
      message:
        'An error occurred while processing your review. Please try again later.',
      success: false,
    };
  }
}

// --- New Booking Action ---

const BookingSchema = z.object({
  activityId: z.string(),
  userId: z.string().min(1, 'User must be logged in.'),
  date: z.string().min(1, 'Please select a date.'),
  paymentMethod: z.string().min(1, 'Please select a payment method.'),
  guests: z.coerce.number().min(1),
});

export type BookingState = {
  errors?: {
    userId?: string[];
    date?: string[];
    paymentMethod?: string[];
    guests?: string[];
  };
  message?: string | null;
  success?: boolean;
  bookingId?: string;
  paymentMethod?: string;
};

export async function processBooking(
  prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const validatedFields = BookingSchema.safeParse({
    activityId: formData.get('activityId'),
    userId: formData.get('userId'),
    date: formData.get('date'),
    paymentMethod: formData.get('paymentMethod'),
    guests: formData.get('guests'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
    };
  }
  
  const { firestore } = initializeFirebase();
  const { activityId, userId, date, guests } = validatedFields.data;

  const allActivities = [
    ...getWaterSports(),
    ...getTours(),
    ...getAccommodations(),
  ];
  const activity = allActivities.find((a) => a.id === activityId);

  if (!activity) {
    return { message: 'Activity not found.', success: false };
  }
  
  const pricePer = (activity as any).price_per_person || (activity as any).price;
  const basePrice = (activity as any).basePrice;

  let totalAmount = 0;
  if(pricePer) {
    totalAmount = pricePer * guests;
  } else if (basePrice) {
    const capacity = (activity as any).capacity || 0;
    const excessGuests = Math.max(0, guests - capacity);
    const excessCost = excessGuests * ((activity as any).excess || 0);
    totalAmount = basePrice + excessCost;
  }


  try {
    const bookingRef = await addDoc(collection(firestore, 'users', userId, 'bookings'), {
        booking_reference: doc(collection(firestore, 'id')).id.substring(0,8).toUpperCase(),
        item_name: (activity as any).name || (activity as any).tour_name,
        item_image: activity.images[0],
        check_in_date: date,
        check_out_date: null,
        number_of_guests: guests,
        total_amount: totalAmount,
        booking_status: 'pending',
        paymentStatus: 'pending',
        userId: userId,
        bookingType: 'tour' // assuming all bookable things are tours for now
    });

    revalidatePath('/bookings');

    return {
        success: true,
        message: 'Your booking has been created! Please proceed with payment.',
        bookingId: bookingRef.id,
        paymentMethod: validatedFields.data.paymentMethod,
    };

  } catch (error) {
    console.error('Booking failed:', error);
    return { message: 'Failed to create booking. Please try again.', success: false };
  }
}

// --- AUTH ACTIONS ---

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  data?: z.infer<typeof LoginSchema> | null;
  success?: boolean;
};

export async function login(prevState: LoginState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
      success: false,
    };
  }

  return {
    success: true,
    data: validatedFields.data,
  };
}

const SignupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type SignupState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success?: boolean;
  data?: z.infer<typeof SignupSchema> | null;
};

export async function signup(prevState: SignupState, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
    };
  }

  return {
    success: true,
    message: 'Validation successful. Proceeding with account creation...',
    data: validatedFields.data,
  };
}

export async function logout() {
  // This is a placeholder for a client-side action
  // The actual logout is handled in the Header component which calls Firebase auth.signOut()
  // and then uses the `action` attribute on a form to re-render the page.
  redirect('/login');
}
