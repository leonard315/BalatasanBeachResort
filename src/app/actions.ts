'use server';

import { moderateReview as moderateReviewFlow } from '@/ai/flows/review-moderation-and-suggestions';
import { z } from 'zod';
import type { ModerateReviewOutput } from '@/ai/flows/review-moderation-and-suggestions';
import { revalidatePath } from 'next/cache';
import { doc, setDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { initializeFirebase } from '@/firebase';

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
  name: z.string().min(1, 'Full Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  date: z.string().min(1, 'Please select a date.'),
  paymentMethod: z
    .string()
    .min(1, 'Please select a payment method.'),
  paymentOption: z.string().min(1, 'Please select a payment option.'),
});

export type BookingState = {
  errors?: {
    name?: string[];
    email?: string[];
    date?: string[];
    paymentMethod?: string[];
    paymentOption?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function processBooking(
  prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const validatedFields = BookingSchema.safeParse({
    activityId: formData.get('activityId'),
    name: formData.get('name'),
    email: formData.get('email'),
    date: formData.get('date'),
    paymentMethod: formData.get('paymentMethod'),
    paymentOption: formData.get('paymentOption'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
    };
  }

  // In a real app, you would process the payment with a payment gateway,
  // save the booking to a database, and send a confirmation email.
  // For this demo, we'll just simulate a successful booking.
  console.log('Booking successful:', validatedFields.data);

  revalidatePath('/bookings');

  return {
    success: true,
    message: 'Your booking has been confirmed! You will be redirected shortly.',
  };
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
  const { auth } = initializeFirebase();
  await auth.signOut();
  redirect('/login');
}
