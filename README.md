# Classroom Attendance (Phase 1)

## Project Overview

Classroom Attendance is a fast, QR-based web application designed to replace slow manual roll calls. Teachers can easily manage their classes, generate live QR codes for attendance sessions, and have students scan them to record their IN and OUT times. The application uses a high-fidelity claymorphism UI for a soft, tactile, and modern aesthetic. 

## Tech Stack

- **Frontend:** React 19, Vite, React Router DOM
- **Styling:** Tailwind CSS (v4), clsx, tailwind-merge
- **Icons:** Lucide React
- **Backend/Database:** Firebase Authentication, Cloud Firestore
- **Date Handling:** date-fns

## Installation

1. Clone the repository or download the source code.
2. Ensure you have Node.js installed.
3. Run `npm install` to install dependencies.
4. Set up your Firebase project and copy the credentials to `.env`.
5. Run `npm run dev` to start the local development server.

## Firebase Setup

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** (start in production or test mode).
3. Enable **Authentication** and add the **Google** sign-in provider.
4. Register a Web App in your project settings to obtain your configuration.

## Environment Variables

Copy `.env.example` to a new `.env` file and populate the Firebase Configuration section:

```env
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
```

## Firestore Collections

The application uses the following main collections:

- `teachers`: Teacher profiles managed via Firebase Auth.
- `classes`: Subjects, sections, and schedules created by teachers.
- `students`: Centralized student registry.
- `classStudents`: Junction collection linking students to classes.
- `attendanceSessions`: Individual attendance events (e.g., a single lecture day).
- `attendanceRecords`: Check-in/check-out logs for students in a specific session.
- `registrationRequests`: Pending requests for unknown students trying to scan a QR code.

## Folder Structure

```
src/
├── components/
│   ├── layout/       # Application layout (Sidebar, Navbar)
│   ├── ui/           # Reusable Claymorphism UI components (ClayCard, ClayButton, etc.)
│   ├── classes/      # Class-specific components (CreateClassModal)
│   └── attendance/   # Attendance components (TeacherLiveAttendance, StudentQR)
├── config/           # Firebase configuration and initialization
├── contexts/         # React Contexts (AuthContext)
├── pages/            # Full-page components (Dashboard, Classes, Login, etc.)
├── services/         # Firebase service modules (auth, class, student, attendance)
├── types/            # TypeScript interfaces for Firestore schema
└── utils/            # Utility functions (cn, device)
```

## Current Implemented Features (Phase 1)

- **Firebase Integration**: Modular services handling Firestore queries and updates safely.
- **Authentication**: Teacher login/logout via Google Authentication, protected routing.
- **Design System**: A fully customized, high-fidelity claymorphism UI using Tailwind CSS custom shadows and typography.
- **Dashboard**: High-level overview of today's classes and summary statistics.
- **Class Management**: Create, list, and view class details (schedule, radius, QR expiration).
- **Attendance Session Lifecycle**: Teachers can define IN and OUT windows and start a session.
- **Live Attendance View**: Teacher view displaying real-time check-ins and the QR engine placeholder.
- **Student QR Experience**: A mobile-first check-in flow allowing students to verify their identity and record location/device verified attendance (simulated for Phase 1).

## Features Intentionally Left for Phase 2

- **Dynamic QR Engine**: The actual rotating, cryptographically secure QR token generation and validation.
- **Real Geolocation Tracking**: Verifying the student's physical distance against the `allowedRadius` using the browser's Geolocation API.
- **Advanced Export Generation**: Full CSV/Excel exports using libraries like `xlsx` or `papaparse` for DepEd SF2 and custom formats.
- **Billing Integration**: Stripe or payment gateway integration for Teacher and School plans.
- **Student Roster Import**: Bulk adding students via CSV parsing.
- **Class Settings & Archiving**: Comprehensive modification of existing class configurations.
