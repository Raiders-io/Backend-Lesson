#!/bin/bash

DIRPATH="./"

TZ=UTC
PORT=3333
HOST=0.0.0.0
NODE_ENV=development

# App
LOG_LEVEL=info
APP_KEY=$(openssl rand -base64 32 | tr -dc '[:alnum:]' | head -c 32)
APP_URL=http://${HOST}:
# Session
SESSION_DRIVER=cookie

# Database
DB_CONNECTION=pg
DB_HOST=postgresql
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=lesson_service

create_env(){
    cat << eof > $DIRPATH/.env
TZ=${TZ}
PORT=${PORT}
HOST=${HOST}
NODE_ENV=${NODE_ENV}
LOG_LEVEL=${LOG_LEVEL}
APP_KEY=${APP_KEY}
APP_URL=${APP_URL}${PORT}
SESSION_DRIVER=${SESSION_DRIVER}
DB_CONNECTION=${DB_CONNECTION}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_DATABASE}
eof
}

generate_env() {
    echo "Generating .env file..."
    echo "Choose setup option:"
    read -p "1. Quick setup (default values) 2. Custom setup: " choice
    if [ "$choice" == "1" ]; then
        PORT=3333
        DB_CONNECTION=pg
        DB_PORT=5432
        DB_USER=$(openssl rand -base64 63 | tr -dc '[:alnum:]' | head -c 63) 
        DB_PASSWORD=$(openssl rand -base64 128 | tr -dc '[:alnum:]' | head -c 128) 
    elif [ "$choice" == "2" ]; then
        read -p "Enter PORT (default: 3333): " PORT
        PORT=${PORT:-3333}
        read -p "Enter DB_CONNECTION (default: pg): " DB_CONNECTION
        DB_CONNECTION=${DB_CONNECTION:-pg}
        read -p "Enter DB_HOST (default: postgresql): " DB_HOST
        DB_HOST=${DB_HOST:-postgresql}
        read -p "Enter DB_PORT (default: 5432): " DB_PORT
        DB_PORT=${DB_PORT:-5432}
        read -p "Enter DB_USER (default: postgres): " DB_USER
        DB_USER=${DB_USER:-postgres}
        read -p "Enter DB_PASSWORD (default: postgres): " DB_PASSWORD
    fi
    create_env
    echo ".env file generated."
}

check_env() {
    if [ ! -f .env ]; then
        echo ".env file not found!"
        generate_env
    else
        echo ".env file found."
        read -p "Do you want to regenerate the .env file? (y/n): " regenerate
        if [ "$regenerate" == "y" ]; then
            generate_env
        fi
    fi
}

check_env
docker compose -f $DIRPATH/docker-compose.yml up -d --build