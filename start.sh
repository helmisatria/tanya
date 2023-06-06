#!/bin/sh

# Check if .env.production file exists
if [ -f .env.production ]; then
  # If it exists, load the environment variables from the file
  npx dotenv -e .env.production -- pnpm run db:migrate
else
  # If it doesn't exist, run the migration script without loading any environment variables
  pnpm run db:migrate
fi

# Start the server
pnpm run start
