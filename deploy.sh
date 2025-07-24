#!/bin/bash

# Build and deployment script for the Lema Task application

set -e

echo "🐳 Building Docker image..."
docker build -t lema-task:latest .

echo "✅ Docker image built successfully!"

echo "🚀 Starting the application..."
docker-compose up -d

echo "🎉 Application is running at http://localhost:3000"

# Optional: Show container logs
echo "📋 Showing container logs (Ctrl+C to exit):"
docker-compose logs -f app
