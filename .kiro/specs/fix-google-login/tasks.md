# Implementation Plan

- [ ] 1. Fix admin email check in user creation
  - Update the email check in `createOrUpdateUser()` function from `admin@balatasan.com` to `admin@balatasanresort.com`
  - File: `src/lib/data.ts` line ~52
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 2. Implement role-based redirect logic for authentication
  - [ ] 2.1 Create `getRedirectPath()` helper function
    - Add helper function that returns `/admin` for admin email, `/bookings` for others
    - Place at the top of the login page component
    - _Requirements: 1.5, 1.6, 5.1, 5.2, 5.3_
  
  - [ ] 2.2 Update Google Sign-In handler with role-based redirect
    - Modify `handleGoogleLogin()` function to use `getRedirectPath()`
    - Replace hardcoded `/bookings` redirect with dynamic redirect based on user email
    - _Requirements: 1.5, 1.6, 5.2_
  
  - [ ] 2.3 Update email/password login handler with role-based redirect
    - Modify the `useEffect` that handles email/password login
    - Replace hardcoded `/bookings` redirect with dynamic redirect based on user email
    - _Requirements: 1.5, 1.6, 5.1_

- [ ] 3. Enhance error handling for Google Sign-In
  - [ ] 3.1 Add specific error handling for common Google Sign-In errors
    - Handle `auth/popup-blocked` error
    - Handle `auth/popup-closed-by-user` error
    - Handle `auth/network-request-failed` error
    - Provide user-friendly error messages for each case
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Fix booking management CRUD operations
  - [ ] 4.1 Enhance error handling in `updateBookingStatus()` server action
    - Add specific error messages for `permission-denied` errors
    - Add specific error messages for `not-found` errors
    - Include error code and message in console logs
    - Return detailed error information to the client
    - File: `src/app/admin/bookings/actions.ts`
    - _Requirements: 6.3, 6.4_
  
  - [ ] 4.2 Verify and document Firebase Admin SDK configuration
    - Check if `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable exists
    - Add console warning if service account is not configured
    - Document the setup process in code comments
    - File: `src/firebase/server.ts`
    - _Requirements: 6.2, 6.4_
  
  - [ ] 4.3 Add environment variable setup instructions
    - Create or update `.env.local.example` file with required variables
    - Document how to obtain Firebase service account key
    - _Requirements: 6.2_

- [ ] 5. Verify Firestore security rules for admin operations
  - Review `firestore.rules` to ensure admin users can update bookings
  - Verify the `isAdmin()` function correctly identifies admin users
  - Test that collection group queries work for admin users
  - _Requirements: 6.1, 6.2, 6.5_

- [ ]* 6. Test authentication flows
  - [ ]* 6.1 Test Google Sign-In for regular users
    - Verify popup appears
    - Verify user document is created
    - Verify redirect to `/bookings`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 6.2 Test Google Sign-In for admin user
    - Verify redirect to `/admin`
    - Verify user document has `userType: 'admin'`
    - _Requirements: 1.6, 5.2_
  
  - [ ]* 6.3 Test email/password login for admin user
    - Verify redirect to `/admin`
    - _Requirements: 5.1_
  
  - [ ]* 6.4 Test error scenarios
    - Test with popup blocker enabled
    - Test with invalid credentials
    - Verify error messages are user-friendly
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 6.5 Test session persistence
    - Login and refresh page
    - Verify user remains authenticated
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 7. Test booking management CRUD operations
  - [ ]* 7.1 Test booking status updates as admin
    - Navigate to `/admin/bookings`
    - Update booking status to each available option
    - Verify success toast appears
    - Verify status updates in Firestore
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ]* 7.2 Test error scenarios
    - Test with invalid booking ID
    - Test with network disconnected
    - Verify error messages are displayed
    - _Requirements: 6.4_
