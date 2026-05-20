# AI Crypto Dashboard

A full-stack crypto advisor dashboard that aggregates live coin prices, market news, AI-generated insights, and community memes. Features quiz-based onboarding that personalizes your feed, a voting system across all content types, and per-user dashboard customization. Built with React 19, Express 5, MongoDB, and Docker.

## Features

- **Quiz Onboarding** — New users answer questions about investor type, preferred coins, risk level, and content preferences. The dashboard adapts to their answers.
- **Live Coin Prices** — Real-time prices, 24h change, market cap, volume, and rank from CoinGecko
- **Personalized Dashboard** — Users control which coins and sections appear. Add/remove coins with a "+" button; toggle entire sections (Prices, News, Insights, Memes) via the settings gear
- **Market News** — Crypto news from CryptoPanic (requires API key)
- **AI Insights** — AI-generated market tips via OpenRouter (requires API key)
- **Crypto Memes** — Community memes from Reddit (no API key required)
- **Voting System** — Like/dislike content across all sections. Click again to undo
- **Dark / Light Mode** — Theme toggle with localStorage persistence
- **Auto-Seed** — Database auto-populates with coins, news, insights, memes, and quiz questions on first startup. No manual seeding needed
- **JWT Authentication** — Registration, login, and protected routes

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + TypeScript | UI with strict typing |
| Build | Vite 7 | Dev server + production builds |
| UI Library | Material UI (MUI) 7 | Component library with custom theme |
| HTTP Client | Axios | Interceptors, centralized error handling |
| Routing | React Router DOM 7 | Route guards for auth and onboarding |
| Backend | Express 5 (Node.js) | REST API server |
| Database | MongoDB 7 + Mongoose 8 | Document storage with ODM |
| Auth | JWT + bcrypt | Token-based authentication |
| Infrastructure | Docker + Docker Compose | One-command local setup |
| External APIs | CoinGecko, CryptoPanic, OpenRouter, Reddit | Market data, news, AI insights, memes |

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### 1. Clone the repository
```bash
git clone https://github.com/OsherElikamel/ai-crypto-dashboard.git
cd ai-crypto-dashboard
```

### 2. Configure environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The app works out of the box with coin prices and memes (CoinGecko and Reddit public APIs). For news and AI insights, add your API keys to `backend/.env` — see [Environment Variables](#environment-variables).

### 3. Start with Docker Compose
```bash
docker compose up --build
```

The backend auto-seeds the database on first startup with coins, quiz questions, sample news, insights, and memes. Live prices are fetched from CoinGecko and a fresh meme is loaded from Reddit automatically.

### 4. Open the app
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Mongo Express (DB UI) | http://localhost:8081 |

### 5. Register and explore
Create an account, complete the onboarding quiz, and your dashboard will be personalized based on your answers. Use the settings gear to toggle sections and the "+" button on Coin Prices to manage tracked coins.

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Create a new account | No |
| POST | /auth/login | Sign in | No |
| GET | /auth/me | Get current user | Yes |
| PATCH | /auth/preferences | Update user preferences (coins, sections) | Yes |

### Content
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /coins | List coins (paginated, filterable by `?symbols=`) | No |
| GET | /coins/:id | Get coin by ID | No |
| GET | /insights | List AI insights | No |
| GET | /insights/:id | Get insight by ID | No |
| GET | /news | List news articles | No |
| GET | /news/:id | Get news item by ID | No |
| GET | /memes | List memes | No |
| GET | /memes/:id | Get meme by ID | No |

### External Providers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/news/one | Fetch hot news (CryptoPanic) | No |
| GET | /api/prices/one | Fetch BTC price (CoinGecko) | No |
| POST | /api/insight/one | Generate AI insight (OpenRouter) | No |
| GET | /api/meme/one | Fetch meme (Reddit) | No |
| POST | /api/prices/refresh | Refresh all coin prices from CoinGecko | No |
| POST | /api/meme/refresh | Fetch and store a new random meme | No |

### Quiz
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /quiz/questions | Get onboarding quiz questions | Yes |
| POST | /quiz/answers | Submit quiz answers | Yes |

### Voting
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /vote/:type/:id | Vote on content (like/dislike/clear) | Yes |

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8080) | No |
| `ORIGIN` | CORS allowed origin | No |
| `MONGODB_URI` | MongoDB connection string | No (set by Docker Compose) |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes |
| `CG_API_KEY` | CoinGecko demo API key (optional, increases rate limits) | No |
| `CRYPTOPANIC_TOKEN` | CryptoPanic auth token (enables live news) | No |
| `OPENROUTER_KEY` | OpenRouter API key (enables AI insights) | No |
| `REDDIT_CLIENT_ID` | Reddit app client ID (optional, public API works without) | No |
| `REDDIT_CLIENT_SECRET` | Reddit app client secret | No |

### Frontend (`frontend/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SERVER_URL` | Backend API URL | No (set by Docker Compose) |

### What works without API keys
- **Coin prices** — CoinGecko public API (rate-limited but functional)
- **Memes** — Reddit public JSON API (no auth needed)
- **Voting, quiz, preferences** — all local, no external APIs

### What needs API keys
- **News** — requires `CRYPTOPANIC_TOKEN` ([get one here](https://cryptopanic.com/developers/api/))
- **AI Insights** — requires `OPENROUTER_KEY` ([get one here](https://openrouter.ai/keys))

## Project Structure

```
ai-crypto-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers (auth, coins, news, memes, quiz, vote, providers)
│   │   ├── middleware/         # JWT auth middleware, global error handler
│   │   ├── models/            # Mongoose schemas (User, Coin, Insight, NewsItem, Meme, Questions)
│   │   ├── routes/            # Express routers (auth, content, api, quiz, vote)
│   │   ├── services/          # External API integrations (CoinGecko, CryptoPanic, OpenRouter, Reddit)
│   │   ├── config.js          # Centralized environment variable reading
│   │   ├── db.js              # MongoDB connection
│   │   ├── index.js           # Express app entry point + auto-seed on startup
│   │   └── seed.js            # Auto-seed module (coins, quiz questions, sample content)
│   ├── scripts/seed.js        # Manual seed script (legacy)
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/     # CoinsSection, NewsSection, InsightsSection, MemeSection, AddCoinDialog, SectionSettingsDialog
│   │   │   ├── layout/        # AppShell (AppBar + theme toggle + Outlet)
│   │   │   └── ui/            # VoteButtons
│   │   ├── contexts/          # AuthContext (JWT + user state), ThemeContext (dark/light)
│   │   ├── pages/             # AuthPage, OnboardingPage, DashboardPage
│   │   ├── routes/            # Route definitions + guards (GuestRoute, OnboardedRoute, NotOnboardedRoute)
│   │   ├── services/          # API calls (auth.service, dashboard.service, quiz.service)
│   │   ├── types/             # TypeScript interfaces (Coin, Insight, NewsItem, Meme, User)
│   │   ├── utils/             # Axios client (api.ts), input validation
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # React entry point
│   │   └── theme.ts           # MUI theme configuration
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── LICENSE
└── README.md
```

## License

MIT
