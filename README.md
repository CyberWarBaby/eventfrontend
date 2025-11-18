# Event Booking Frontend

Simple React + Vite frontend for the Railway-hosted Event Booking API.

How to run:

1. cd into the project

   ```bash
   cd "./event-booking-frontend"
   npm install
   npm run dev
   ```

2. Open http://localhost:5173 and use the Signup / Login pages.

Notes:
- The app stores the JWT token in localStorage under `token` and the user email under `userEmail`.
- The Holding JSON button stores the event JSON in an in-memory context; you can extend it to export or reuse.
