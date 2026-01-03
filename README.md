# Mitra Student Hub

A premium student dashboard application built with **React Native (Expo)**, **Clerk Authentication**, and **React Navigation**.

## Features
- **Secure Authentication**: Email/Password Sign-up and Sign-in powered by Clerk.
- **Protected Routes**: Unauthenticated users cannot access the dashboard.
- **Premium UI**: Light-themed, clean, and responsive design.
- **Student Dashboard**: Quick access to Notices, Events, Results, and Library.
- **Profile Management**: View user details and logout.

## Prerequisites
- Node.js & npm/yarn
- Expo Go app (for testing on device) or Simulator

## Setup Instructions

1. **Clone the repository** (if applicable) or navigate to the project folder:
   ```bash
   cd mitra-student-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Clerk**:
   - Create an account on [Clerk.com](https://clerk.com/).
   - Create a new application.
   - Copy your **Publishable Key**.
   - Create a `.env` file in the root directory.
   - Add your key:
     ```
     EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     ```

4. **Run the App**:
   ```bash
   npx expo start
   ```
   - Scan the QR code with Expo Go (Android/iOS).
   - Or press `i` for iOS Simulator / `a` for Android Emulator.

## Project Structure
- `src/screens`: UI Screens (Home, Profile, Login, Signup).
- `src/navigation`: App Navigation logic.
- `src/utils`: Utilities like `tokenCache`.
- `progress.md`: Development log.

## Verification
- **Sign Up**: Create a new account. You will receive an email code for verification.
- **Login**: Use existing credentials.
- **Dashboard**: Only accessible after login.
- **Logout**: Clears session and returns to Login screen.

---
Built for Mitra Frontend Internship Assignment.
