# Design Document: Fix Google Login

## Overview

This design addresses the Google Sign-In authentication issues and implements proper role-based redirect logic for admin users. The solution involves:

1. Fixing the Google Sign-In configuration and implementation
2. Correcting the admin email check in the user creation logic
3. Implementing role-based redirect logic that sends admin users to `/admin` and regular users to `/bookings`
4. Ensuring consistent authentication behavior across both email/password and Google Sign-In methods

## Architecture

### Authentication Flow

```
User Action (Click Login Button)
    ↓
Authentication Method Selection
    ├─→ Email/Password Flow
    │       ↓
    │   signInWithEmailAndPassword()
    │       ↓
    │   createOrUpdateUser()
    │       ↓
    │   Determine Redirect (based on email)
    │       ↓
    │   Navigate to /admin or /bookings
    │
    └─→ Google Sign-In Flow
            ↓
        signInWithPopup()
            ↓
        createOrUpdateUser()
            ↓
        Determine Redirect (based on email)
            ↓
        Navigate to /admin or /bookings
```

### Key Components

1. **Login Page Component** (`src/app/login/page.tsx`)
   - Handles both email/password and Google Sign-In
   - Manages authentication state and error handling
   - Implements redirect logic based on user role

2. **User Data Management** (`src/lib/data.ts`)
   - `createOrUpdateUser()` function creates/updates user documents
   - Determines user type (admin vs guest) based on email
   - Stores user profile in Firestore

3. **Firebase Configuration** (`src/firebase/config.ts`, `src/firebase/index.ts`)
   - Initializes Firebase app with correct credentials
   - Provides auth and firestore instances

## Components and Interfaces

### Modified Functions

#### 1. `createOrUpdateUser()` in `src/lib/data.ts`

**Current Issue:**
- Checks for `admin@balatasan.com` instead of `admin@balatasanresort.com`

**Fix:**
```typescript
const userType = user.email === 'admin@balatasanresort.com' ? 'admin' : 'guest';
```

#### 2. `handleGoogleLogin()` in `src/app/login/page.tsx`

**Current Implementation:**
- Calls `signInWithPopup()`
- Creates/updates user document
- Redirects to `/bookings` for all users

**Enhanced Implementation:**
- Calls `signInWithPopup()`
- Creates/updates user document
- Checks user email to determine redirect destination
- Redirects to `/admin` if email is `admin@balatasanresort.com`
- Redirects to `/bookings` for all other users

#### 3. Email/Password Login Handler in `src/app/login/page.tsx`

**Current Implementation:**
- Redirects all users to `/bookings`

**Enhanced Implementation:**
- Checks user email after successful authentication
- Redirects to `/admin` if email is `admin@balatasanresort.com`
- Redirects to `/bookings` for all other users

### Helper Function

Create a reusable redirect helper function:

```typescript
const getRedirectPath = (email: string): string => {
  return email === 'admin@balatasanresort.com' ? '/admin' : '/bookings';
};
```

This function will be used in both authentication flows to ensure consistency.

## Data Models

### User Document Structure

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  userType: 'admin' | 'guest';
  isActive: boolean;
  photoURL: string;
  displayName?: string;
}
```

**Key Fields for This Feature:**
- `email`: Used to determine if user is admin
- `userType`: Set to 'admin' for admin@balatasanresort.com, 'guest' for others

## Error Handling

### Google Sign-In Errors

The implementation handles the following error scenarios:

1. **Operation Not Allowed** (`auth/operation-not-allowed`)
   - Message: "Google Sign-In is not enabled. Please check your Firebase project settings."
   - Action: Display toast notification with error

2. **Popup Blocked** (`auth/popup-blocked`)
   - Message: "Popup was blocked. Please allow popups for this site."
   - Action: Display toast notification with instructions

3. **Network Errors** (`auth/network-request-failed`)
   - Message: "Network error. Please check your connection."
   - Action: Display toast notification

4. **Cancelled by User** (`auth/popup-closed-by-user`)
   - Message: "Sign-in was cancelled."
   - Action: Display toast notification (informational)

5. **Generic Errors**
   - Message: Display the Firebase error message
   - Action: Log to console and display toast notification

### Email/Password Login Errors

Existing error handling:
- Invalid credentials
- Operation not allowed
- Generic Firebase errors

## Testing Strategy

### Manual Testing Checklist

1. **Google Sign-In - Regular User**
   - Click "Login with Google"
   - Select a non-admin Google account
   - Verify redirect to `/bookings`
   - Verify user document created in Firestore with `userType: 'guest'`

2. **Google Sign-In - Admin User**
   - Click "Login with Google"
   - Select Google account with email `admin@balatasanresort.com`
   - Verify redirect to `/admin`
   - Verify user document created with `userType: 'admin'`

3. **Email/Password - Regular User**
   - Enter non-admin credentials
   - Click "Login"
   - Verify redirect to `/bookings`

4. **Email/Password - Admin User**
   - Enter email: `admin@balatasanresort.com`
   - Enter password: `admin123`
   - Click "Login"
   - Verify redirect to `/admin`

5. **Error Scenarios**
   - Test with popup blocker enabled
   - Test with network disconnected
   - Test cancelling the Google Sign-In popup
   - Verify appropriate error messages displayed

6. **Session Persistence**
   - Log in successfully
   - Refresh the page
   - Verify user remains authenticated
   - Verify no re-authentication required

### Firebase Console Configuration Verification

Before testing, verify in Firebase Console:

1. **Authentication Providers**
   - Navigate to Authentication > Sign-in method
   - Verify Google provider is enabled
   - Verify Email/Password provider is enabled

2. **Authorized Domains**
   - Check that the application domain is listed in authorized domains
   - For local development, ensure `localhost` is authorized

3. **Project Configuration**
   - Verify the Firebase config in `src/firebase/config.ts` matches the project
   - Confirm `projectId`, `apiKey`, and `authDomain` are correct

## Implementation Notes

### Code Changes Required

1. **File: `src/lib/data.ts`**
   - Line ~52: Change `admin@balatasan.com` to `admin@balatasanresort.com`

2. **File: `src/app/login/page.tsx`**
   - Add `getRedirectPath()` helper function
   - Update `handleGoogleLogin()` to use role-based redirect
   - Update email/password login handler to use role-based redirect

### No Breaking Changes

- Existing user documents remain unchanged
- Authentication flow remains the same for end users
- Only redirect logic is enhanced

### Security Considerations

- Admin status is determined by email address match
- Email verification status is stored but not currently enforced
- Consider adding email verification requirement in future enhancement
- User type is stored in Firestore and can be queried for authorization checks

## Future Enhancements

1. **Role-Based Access Control**
   - Implement middleware to protect admin routes
   - Add role checking on server-side API routes

2. **Email Verification**
   - Require email verification before allowing access
   - Send verification emails on signup

3. **Multi-Admin Support**
   - Store admin emails in Firestore configuration
   - Allow dynamic admin role assignment

4. **Audit Logging**
   - Log all authentication attempts
   - Track admin actions for security

5. **Session Management**
   - Implement session timeout
   - Add "Remember Me" functionality


## Booking Management CRUD Operations

### Current Implementation Analysis

The booking management system uses:
- **Client-side**: React components with real-time Firestore listeners
- **Server-side**: Server Actions with Firebase Admin SDK for updates

### Potential Issues and Solutions

#### Issue 1: Firebase Admin SDK Configuration

**Problem**: The server-side Firebase Admin SDK requires a service account key to authenticate. Without proper configuration, CRUD operations will fail. Additionally, the Admin SDK bypasses Firestore security rules, but the current implementation may not be properly initialized.

**Root Cause**: The `adminDb` from Firebase Admin SDK should bypass security rules entirely, but if the service account is not configured, operations will fail silently or with permission errors.

**Solution**:
1. Verify `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is set in `.env.local`
2. For local development without service account:
   - Use Firestore in "test mode" (allow all reads/writes) temporarily
   - OR configure the service account properly
3. For production, ensure service account JSON is properly configured in environment variables
4. Add better error logging to identify authentication issues

#### Issue 2: Firestore Security Rules

**Problem**: Firestore security rules may block admin operations if not properly configured.

**Solution**:
Ensure `firestore.rules` allows admin users to update booking documents:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/bookings/{bookingId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || 
                      request.auth.token.email == 'admin@balatasanresort.com');
      allow write: if request.auth != null && 
                      (request.auth.uid == userId || 
                       request.auth.token.email == 'admin@balatasanresort.com');
    }
  }
}
```

#### Issue 3: Path Revalidation

**Problem**: After updating booking status, the UI may not reflect changes immediately.

**Solution**: The current implementation already calls `revalidatePath()` for:
- `/admin/bookings` - Admin bookings list
- `/admin` - Admin dashboard
- `/bookings` - User bookings view

This should work correctly with Next.js App Router caching.

#### Issue 4: Error Handling

**Problem**: Generic error messages don't help diagnose issues.

**Solution**: Enhanced error handling in `updateBookingStatus()`:

```typescript
try {
  const bookingRef = adminDb.doc(bookingPath);
  await bookingRef.update({ booking_status: status });
  // ... success handling
} catch (error) {
  console.error('Error updating booking status:', error);
  
  // Provide specific error messages
  if (error.code === 'permission-denied') {
    return {
      success: false,
      message: 'Permission denied. Please check Firestore security rules.',
    };
  }
  
  if (error.code === 'not-found') {
    return {
      success: false,
      message: 'Booking not found.',
    };
  }
  
  return {
    success: false,
    message: `Error: ${error.message || 'Unknown error occurred'}`,
  };
}
```

### Testing Booking CRUD Operations

1. **Verify Firebase Admin SDK Setup**
   - Check if `FIREBASE_SERVICE_ACCOUNT_KEY` is set
   - Test server action execution
   - Check console for initialization errors

2. **Test Status Updates**
   - Navigate to `/admin/bookings`
   - Click action menu on a booking
   - Select each status option
   - Verify toast notifications appear
   - Verify status updates in Firestore

3. **Test Error Scenarios**
   - Test with invalid booking ID
   - Test with missing userId
   - Test with network disconnected
   - Verify appropriate error messages

4. **Verify Security Rules**
   - Test as admin user
   - Test as regular user (should not access admin page)
   - Verify Firestore rules allow admin operations
