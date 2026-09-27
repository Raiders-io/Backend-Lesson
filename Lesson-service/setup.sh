#!/bin/sh

# This script is used to set up the migration for the lesson service.
# It will create the database and run the migrations.

# Run the migrations
echo "Running migrations..."
node ace.js migration:run --force
# npm run migration-force

# Seed the database (optional)
echo "Seeding the database..."
node ace.js db:seed || true
# npm run seed

# Start the server
echo "Starting the server..."
if [ "$NODE_ENV" = "production" ]; then
    exec node bin/server.js
else
    exec npm run dev
fi
