#!/bin/bash
set -euo pipefail

# Frontend (Node.js)
[ -d "frontend" ] && {
  echo "📦 Instalando Node.js..."
  export PATH="/root/.local/share/fnm:$PATH"
  fnm use $(grep 'nodejs' .tool-versions | cut -d' ' -f2)
  
  cd frontend/frontend-payments
  npm install
  npm run build
  cd ../..
}

# Backend (Java)
[ -f "pom.xml" ] && {
  echo "⚙️ Build do backend..."
  ./mvnw clean package -DskipTests
}