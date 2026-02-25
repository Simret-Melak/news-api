# News API Backend (A2SV Eskalate Assessment)

A production-ready REST API where **Authors publish content** and **Readers consume it**.  
Includes authentication, RBAC, soft deletion, read tracking, and a daily analytics engine powered by **BullMQ + Redis**.

> All backend code lives inside `/backend` as required.

---

## Tech Stack

- Node.js + TypeScript
- Express
- PostgreSQL (Docker) + Prisma ORM
- Redis (Docker) + BullMQ
- JWT Authentication + RBAC

---

## Project Structure

repo/
├── README.md  
├── .env.example  
└── backend/  
&nbsp;&nbsp;&nbsp;&nbsp;├── src/  
&nbsp;&nbsp;&nbsp;&nbsp;├── prisma/  
&nbsp;&nbsp;&nbsp;&nbsp;├── docker-compose.yml  
&nbsp;&nbsp;&nbsp;&nbsp;├── package.json  
&nbsp;&nbsp;&nbsp;&nbsp;└── tsconfig.json  

---


### Prerequisites
- Node.js (LTS)
- Docker + Docker Compose
- npm

### Setup Steps
```bash
# 1. Clone and enter directory
git clone <GITHUB_REPO_URL>
cd news-api

# 2. Setup environment
cp .env.example backend/.env
cd backend

# 3. Install dependencies
npm install

# 4. Start PostgreSQL and Redis
docker compose up -d

# 5. Run database migrations
npx prisma migrate dev
npx prisma generate

# 6. Start API server (terminal 1)
npm run dev

# 7. Start analytics worker (terminal 2)
npm run worker


## API Endpoints

### Author Only Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/articles` | Create article |
| GET | `/articles/me` | List my articles (add `?includeDeleted=true` to include deleted) |
| PUT | `/articles/:id` | Update article |
| DELETE | `/articles/:id` | Soft delete article |
| GET | `/author/dashboard` | View engagement metrics |

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | Public feed (filters: `category`, `author`, `q`, `page`, `size`) |
| GET | `/articles/:id` | Read article (creates ReadLog for analytics) |