# AI Crypto Dashboard

A full-stack crypto advisor dashboard that aggregates market news, coin prices, AI-generated insights, and community memes. Features quiz-based onboarding to personalize content and a voting system across all content types. Built with React 19, Express 5, MongoDB, and Docker.

## Features

- **User Authentication** — JWT-based registration and login
- **Quiz Onboarding** — Personalize your feed by answering questions about investor type, preferred coins, risk level, and content preferences
- **Market News** — Hot crypto news from CryptoPanic
- **Coin Prices** — Live prices from CoinGecko
- **AI Insights** — AI-generated tips via OpenRouter (GPT-4o-mini)
- **Crypto Memes** — Community memes from Reddit
- **Voting System** — Like/dislike content across all sections
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite 7 (dev server + build)
- Material UI (MUI) 7
- Axios (HTTP client)
- React Router DOM 7

### Backend
- Express 5 (Node.js)
- MongoDB with Mongoose 8
- JWT authentication (jsonwebtoken + bcrypt)
- External API integrations (CoinGecko, CryptoPanic, OpenRouter, Reddit)

### Infrastructure
- Docker & Docker Compose
- MongoDB 7
- Mongo Express (DB admin UI)

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- API keys for external services (see Environment Variables below)

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
Edit `backend/.env` and fill in your API keys.

### 3. Start with Docker Compose
```bash
docker compose up --build
```

### 4. Seed the database
```bash
docker compose exec backend npm run seed
```

### 5. Open the app
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Mongo Express**: http://localhost:8081

### Demo User
After seeding, you can log in with:
- **Email**: `demo@example.com`
- **Password**: `secret123`

## API Endpoints

### Auth
| Method | Endpoint         | Description           | Auth |
|--------|------------------|-----------------------|------|
| POST   | /auth/register   | Create a new account  | No   |
| POST   | /auth/login      | Sign in               | No   |
| GET    | /auth/me         | Get current user      | Yes  |

### Content
| Method | Endpoint         | Description           | Auth |
|--------|------------------|-----------------------|------|
| GET    | /coins           | List coins (paginated)| No   |
| GET    | /coins/:id       | Get coin by ID        | No   |
| GET    | /insights        | List insights         | No   |
| GET    | /insights/:id    | Get insight by ID     | No   |
| GET    | /news            | List news             | No   |
| GET    | /news/:id        | Get news item by ID   | No   |
| GET    | /memes           | List memes            | No   |
| GET    | /memes/:id       | Get meme by ID        | No   |

### External Providers
| Method | Endpoint           | Description                | Auth |
|--------|--------------------|----------------------------|------|
| GET    | /api/news/one      | Fetch hot news (CryptoPanic)| No  |
| GET    | /api/prices/one    | Fetch BTC price (CoinGecko)| No   |
| POST   | /api/insight/one   | Generate AI insight        | No   |
| GET    | /api/meme/one      | Fetch meme (Reddit)        | No   |

### Quiz
| Method | Endpoint         | Description           | Auth |
|--------|------------------|-----------------------|------|
| GET    | /quiz/questions  | Get onboarding quiz   | Yes  |
| POST   | /quiz/answers    | Submit quiz answers   | Yes  |

### Voting
| Method | Endpoint              | Description                | Auth |
|--------|-----------------------|----------------------------|------|
| POST   | /vote/:type/:id       | Vote on content (like/dislike/clear) | Yes |

## Environment Variables

### Backend (`backend/.env`)
| Variable                         | Description                        |
|----------------------------------|------------------------------------|
| `PORT`                           | Server port (default: 8080)        |
| `ORIGIN`                         | CORS allowed origin                |
| `MONGODB_URI`                    | MongoDB connection string          |
| `JWT_SECRET`                     | Secret for signing JWT tokens      |
| `COIN_GECKO_URL`                 | CoinGecko API endpoint             |
| `CG_API_KEY`                     | CoinGecko demo API key             |
| `CRYPTOPANIC_URL`                | CryptoPanic API endpoint           |
| `CRYPTOPANIC_TOKEN`              | CryptoPanic auth token             |
| `OPENROUTER_URL`                 | OpenRouter API endpoint            |
| `OPENROUTER_KEY`                 | OpenRouter API key                 |
| `REDDIT_ACCESS_TOKEN`            | Reddit OAuth2 token endpoint       |
| `REDDIT_CLIENT_ID`               | Reddit app client ID               |
| `REDDIT_CLIENT_SECRET`           | Reddit app client secret           |
| `REDDIT_CRYPTO_CURRENCY_MEMES_URL` | Reddit memes subreddit endpoint  |
| `REDDIT_BASE_URL`                | Reddit domain base URL             |

### Frontend (`frontend/.env`)
| Variable          | Description                    |
|-------------------|--------------------------------|
| `VITE_SERVER_URL` | Backend API URL                |

## Project Structure

```
ai-crypto-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/         # Auth middleware, error handler
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # External API integrations
│   │   ├── config.js          # Centralized configuration
│   │   ├── db.js              # MongoDB connection
│   │   └── index.js           # Express app entry point
│   ├── scripts/               # Database seeding
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI components
│   │   ├── contexts/          # Auth context provider
│   │   ├── routes/            # Route definitions & guards
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # API client, validation
│   │   ├── enums/             # Shared enumerations
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # React entry point
│   │   └── theme.ts           # MUI theme configuration
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## License

MIT
