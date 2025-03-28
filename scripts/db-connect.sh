#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Connecting at postgresql://admin:{PASSWORD HIDDEN}@$POSTGRES_HOST:5432/main_db"
# Prompt for password to avoid having it in command history
PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "5432" -U "admin" -d "main_db"

exit $? 
