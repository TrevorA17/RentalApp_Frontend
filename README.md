# RentalApp Frontend

Next.js frontend for the Rental House Hunting Platform MVP.

## Current status

This repo is no longer scaffold-only. The frontend currently includes:

- auth screens and session handling
- public listing browse and detail pages
- paginated and sorted listing browse UX with query-state persistence
- profile management
- listing creation and editing
- upload-first listing media attachments with optional external URL fallback
- saved listings
- inquiries
- public agent profile page
- agent recommendations/testimonials UI
- personalized listing suggestions on the dashboard
- admin moderation screens for listings, reports, and users
- admin recommendation moderation and recent moderation history
- AI description assist in listing forms
- AI natural-language search interpretation on the public browse page

## Stack

- Next.js App Router
- TypeScript
- MUI

## Product terminology

- `recommendations` = public agent testimonials/reviews
- `suggestions` = personalized listing picks for signed-in users

## Current route surface

- `/`
- `/login`
- `/register`
- `/listings`
- `/listings/[listingId]`
- `/agents/[agentUserId]`
- `/dashboard`
- `/profile`
- `/saved-listings`
- `/inquiries/sent`
- `/inquiries/received`
- `/my-listings`
- `/my-listings/new`
- `/my-listings/[listingId]/edit`
- `/admin`
- `/admin/listings`
- `/admin/reports`
- `/admin/users`
- `/admin/recommendations`

## Environment

Create a real env file from one of the tracked templates:

- local: copy [.env.local.example](./.env.local.example) to the ignored `.env.local`
- UAT: copy [.env.uat.example](./.env.uat.example) to an ignored runtime env file such as `.env.uat`, or inject the same value through your deployment platform

Current important variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Current auth/session architecture:

- centralized API client in `src/lib/api/client.ts`
- browser session store in `src/lib/auth/sessionStore.ts`
- refresh-aware retry flow for protected API requests
- clean session clearing when refresh fails

## Local development

Install dependencies:

```powershell
npm install
```

Run the app:

```powershell
npm run dev
```

Run the current containerized MVP stack from the backend repo:

```powershell
cd ..\RentalApp_backend
docker compose up -d
```

That stack currently includes:

- frontend on `http://localhost:3000`
- backend on `http://localhost:8080`
- postgres on `localhost:5433`

It does not include Qdrant or Ollama because the current frontend does not depend on them.

Quality checks:

```powershell
npm run lint
npm run build
```

## Current implementation truth

- the public agent profile page shows recommendations and allows authenticated submission
- the public listings page keeps filter, page, and sort state in the URL
- listing media uploads go through the backend and are served from `/media/...`
- suggestions are a signed-in personalization feature, not a public trust feature
- AI support is currently lightweight listing-description assistance and natural-language search interpretation only

## Not yet implemented

- advanced AI workflows beyond description assist and search interpretation
- object-storage/CDN media pipeline

## Source-of-truth docs

Backend repo planning docs:

- `../RentalApp_backend/docs/API_Contract_V1.md`
- `../RentalApp_backend/docs/MVP_Data_Model.md`
- `../RentalApp_backend/docs/Frontend_Route_Map.md`
- `../RentalApp_backend/plan.md`
