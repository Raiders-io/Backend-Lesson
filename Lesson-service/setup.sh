#!/bin/sh

# This script is used to set up the migration for the lesson service.
# It will create the database and run the migrations.

# Create the database
echo "Creating database ${POSTGRE_DB}..."
psql -h localhost -U postgres -c "CREATE DATABASE ${POSTGRE_DB};"

# Run the migrations
echo "Running migrations..."
node ace migration:run --force

# Seed the database (optional)
echo "Seeding the database..."
node ace db:seed
# Start the server
echo "Starting the server..."
exec npm run dev