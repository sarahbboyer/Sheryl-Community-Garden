# Community Garden Prototype

A React + Vite app with a lightweight backend API for managing garden volunteers and membership interest.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development environment:
   ```bash
   npm run dev
   ```
3. Open the browser at:
   - `http://localhost:4173`

## Pages

- `Home` — landing page with photos, video, and community garden details.
- `Volunteer` — volunteer signup form and schedule.
- `Membership` — membership interest form and plan overview.
- `Admin` — sign in to manage volunteers and membership requests.

## Admin preview credentials

- Email: `admin@communitygarden.org`
- Password: `garden123`

## Backend API

- Runs on `http://localhost:4174`
- Stores prototype data in `server/data.json`
- Includes login, volunteer signup, and membership request endpoints

## Notes

- This is a full React + Vite prototype with a simple Express backend.
- Payment flow is ready to be added later as a separate step.
