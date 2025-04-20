# StackHub

A platform for analyzing GitHub repositories using the specfy/stack-analyser.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database:

   ```bash
   # Start PostgreSQL
   npm run db:up

   # Run migrations
   npm run db:migrate
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `apps/backend` and `apps/frontend`
   - Fill in the required environment variables

4. Start the development servers:

   ```bash
   npm run dev
   ```
