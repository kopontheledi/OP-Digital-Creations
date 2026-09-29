# OP Digital Creations
React + Vite business website with Firebase-powered enquiries and admin dashboard.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and add Firebase Web App credentials.
3. In Firebase Authentication, enable Email/Password and create the private admin user.
4. Create Firestore collections as the app writes them: `quotes`, `projects`, `team`.
5. `npm run dev`

## Admin
Open `/admin`. The dashboard contains Quotations, Portfolio, Team and Analytics sections.

## GA4
Install the normal GA4 tag/Measurement ID on the public website for tracking. The private dashboard intentionally does not expose Google service-account credentials. To show live GA4 metrics inside `/admin`, use the Google Analytics Data API from a trusted backend/Cloud Function and return only the metrics needed by the dashboard.

## Images
Replace founder/team placeholders with real image assets when available.
