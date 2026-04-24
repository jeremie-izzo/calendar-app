# Calendar App

A personal Google Calendar client with attendee-based color rules, per-event color overrides, and a fully customizable UI theme. Runs locally with Docker Compose (app + Postgres).

## Features

- **Google Calendar sync** — reads events from your primary calendar via OAuth2
- **Color rules** — automatically color events based on who is invited (first match wins)
- **Per-event color override** — manually set a color for any individual event from its detail modal
- **Theme editor** — customize all colors and opacities (backgrounds, borders, text, accent) with a live preview
- **Persistent settings** — theme, rules, and event overrides are stored in a local Postgres database

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A Google Cloud project with the Calendar API enabled and an OAuth2 client ID

## Setup

### 1. Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3000` to **Authorized JavaScript origins**
4. Enable the **Google Calendar API** for your project
5. Add your Google account as a test user under OAuth consent screen → Test users

### 2. Environment file

Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_HINT_EMAIL=you@gmail.com
```

`VITE_GOOGLE_HINT_EMAIL` pre-fills the account picker so you skip the selection step.

### 3. Run

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, and you're done.

## Usage

### Calendar views

Use the toolbar buttons to switch between **Month**, **Week**, and **Day** views.

### Color rules

Go to **Settings → Color Rules**. Each rule matches events by attendee email and assigns a color. Rules are evaluated top-to-bottom — the first match wins.

- **Add** — click the `+` button
- **Edit** — click the pencil icon on any rule
- **Delete** — click the trash icon

### Per-event color

Click any event to open its detail modal. Use the color swatches at the bottom to set a custom color for that specific event. Click **Reset** to revert to the rule-matched or default color.

### Theme

Go to **Settings → Appearance**. Every color in the UI has a color picker and an opacity slider. The preview calendar on the right updates live. Click **Reset to defaults** to restore the original theme.

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite + SSR) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Calendar UI | [FullCalendar v6](https://fullcalendar.io/) |
| Auth | [@react-oauth/google](https://github.com/MomenSherif/react-oauth-google) (implicit OAuth2) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + CSS custom properties |
| Database | Postgres 16 via [postgres.js](https://github.com/porsager/postgres) |
| Infrastructure | Docker Compose |

## Development

To run outside Docker (requires a local Postgres instance):

```bash
npm install
DATABASE_URL=postgresql://calendar:calendar@localhost:5432/calendar npm run dev
```
