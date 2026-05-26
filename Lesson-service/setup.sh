!#/bin/bash

# This script is used to set up the migration for the lesson service.
# It will create the database and run the migrations.

# Create the database
psql -h localhost -U postgres -c "CREATE DATABASE ${POSTGRE_DB};"

# Run the migrations
adonis migration:run --force

# Start the server
npm run dev