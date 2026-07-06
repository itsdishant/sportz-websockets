# Sportz WebSockets

Sportz WebSockets is a real-time sports application backend built with Node.js. It provides the foundation for managing sports matches, live commentary, and real-time score updates.

The application is built using Node.js (ES Modules), Express, Drizzle ORM, Zod for schema validation, and a Neon PostgreSQL database.

## Project At A Glance

- Database schema managed via Drizzle ORM featuring `matches` and `commentary` tables.
- Robust Zod validation schemas to ensure data integrity during match creation and score updates.
- Real-time compatible data structures tailored for live sports events.
- PostgreSQL database integration powered by the `pg` driver and hosted on Neon Serverless Postgres.

## Tech Stack

- Node.js (ES Modules)
- Express `5.2`
- PostgreSQL (via `pg` `8.22`)
- Drizzle ORM `0.45`
- Zod `4.4`
- dotenv `17.4`

## Getting Started

Install dependencies from the project directory:

```bash
npm install
```

Configure your environment by creating a `.env` file in the root directory. Add your Neon PostgreSQL connection string:

```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
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
  db/
    db.js                 Database connection and client setup
    schema.js             Drizzle ORM schema definitions (tables, enums)
  validation/
    matches.js            Zod validation schemas for match data
```

## Notes And Caveats

- The database connection relies on a valid `DATABASE_URL` in the `.env` file. The app will throw an error if this is missing.
- The `src/index.js` script currently includes a demonstration of database operations to verify the Drizzle and Neon configuration.
- The generated `drizzle/` directory contains your SQL migrations. These should generally be committed to version control.
- Ensure `.env` is listed in your `.gitignore` to prevent leaking database credentials.

## Useful Files

- `drizzle.config.js` - Configuration for Drizzle Kit (dialect, schema path, database URL).
- `package.json` - npm scripts and project dependencies.
- `.env` - Local environment variables.
