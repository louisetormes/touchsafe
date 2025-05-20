#!/bin/sh

# Frontend
if [ -d "frontend" ]; then
  echo "Build do frontend..."
  cd frontend/frontend-payments
  npm install
  npm run build
  cd ../..
fi

# Backend
if [ -f "pom.xml" ]; then
  echo "Build do backend..."
  chmod +x mvnw
  ./mvnw clean package -DskipTests
fi