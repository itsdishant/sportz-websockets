# Sportz WebSockets

Sportz WebSockets is a real-time sports application backend built with Node.js. It provides the foundation for managing sports matches, live commentary, and real-time score updates using WebSockets.

The application is built using Node.js (ES Modules), Express, Drizzle ORM, Zod for schema validation, a Neon PostgreSQL database, and Arcjet for advanced rate limiting and bot protection.

## Project At A Glance

- **Database:** Schema managed via Drizzle ORM featuring `matches` and `commentary` tables, backed by Neon Serverless Postgres.
- **Validation:** Robust Zod validation schemas to ensure data integrity during match creation and score updates.
- **Real-Time Engine:** Native WebSocket integration to instantly broadcast events (like `match_created`) to connected clients.
- **Security & Rate Limiting:** Integrated with `@arcjet/node` for advanced WAF rules, bot detection, and sliding window rate limiting.

## Tech Stack

- Node.js (ES Modules)
- Express `5.2`
- WebSockets (`ws`)
- PostgreSQL (via `pg` `8.22`)
- Drizzle ORM `0.45`
- Zod `4.4`
- Arcjet `@arcjet/node` `1.7`

## API Endpoints

### HTTP REST Endpoints

#### `GET /`
- **Description**: Health check endpoint.
- **Response**: `sportz-backend running`

#### `GET /matches`
- **Description**: Retrieves a list of matches.
- **Query Parameters**:
  - `limit` (optional): Integer (max 100, default 50).
- **Response**: `200 OK` with a JSON payload containing `{ data: [...] }`.

#### `POST /matches`
- **Description**: Creates a new match and broadcasts a `match_created` event to all active WebSocket clients.
- **Body Payload**:
  - `sport` (string, required)
  - `homeTeam` (string, required)
  - `awayTeam` (string, required)
  - `startTime` (ISO 8601 date string, required)
  - `endTime` (ISO 8601 date string, required, must be after `startTime`)
  - `homeScore` (number, optional, defaults to 0)
  - `awayScore` (number, optional, defaults to 0)
- **Response**: `201 Created` with a JSON payload containing `{ data: [...] }`.

### WebSocket Endpoints

#### `ws://[HOST]:[PORT]/ws`
- **Description**: The main real-time connection. 
- **Events Received by Client**:
  - `welcome`: Initial connection confirmation.
  - `match_created`: Fired instantly when a new match is created via `POST /matches`.

## Getting Started

Install dependencies from the project directory:

```bash
npm install
```

Configure your environment by creating a `.env` file in the root directory. Add your Neon PostgreSQL connection string and your Arcjet API key:

```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
ARCJET_KEY="your-arcjet-key-here"
```

Start the local dev server:

```bash
npm run dev
```

## Available Scripts

Run scripts from `sportz-backend/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the dev server with automatic file watching using Node's native `--watch` flag. |
| `npm start` | Starts the Node.js application normally for production-like execution. |
| `npm run db:generate` | Uses Drizzle Kit to generate SQL migration files based on schema changes. |
| `npm run db:migrate` | Uses Drizzle Kit to apply the generated migrations to your Neon database. |

## Common Workflows

### Development

```bash
npm run dev
```

Use this for day-to-day backend work. Node.js automatically watches for file changes and restarts the server.

### Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

Run these commands sequentially whenever you update the Drizzle schema in `src/db/schema.js`. This ensures your Neon PostgreSQL database stays in sync with your application models.

## App Structure

```text
src/
  index.js                Main application entry point
  arcjet.js               Arcjet security middleware, bot protection, and rate limiting
  ws/
    server.js             WebSocket server logic and broadcasting rules
  routes/
    matches.js            Express routes for the /matches API
  db/
    db.js                 Database connection and client setup
    schema.js             Drizzle ORM schema definitions (tables, enums)
  validation/
    matches.js            Zod validation schemas for match data
```

## Notes And Caveats

- The database connection relies on a valid `DATABASE_URL` in the `.env` file. The app will throw an error if this is missing.
- Arcjet security requires a valid `ARCJET_KEY` in your `.env`. If not provided, it will throw an error on startup.
- The generated `drizzle/` directory contains your SQL migrations. These should generally be committed to version control.
- Ensure `.env` is listed in your `.gitignore` to prevent leaking database credentials and API keys.

## Useful Files

- `drizzle.config.js` - Configuration for Drizzle Kit (dialect, schema path, database URL).
- `package.json` - npm scripts and project dependencies.
- `.env` - Local environment variables.
