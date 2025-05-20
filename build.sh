#!/bin/bash

# --- Frontend (React/Vite) ---
echo "Construindo o frontend React..."
if [ -d "frontend" ]; then
  cd frontend/frontend-payments || { echo "Falha ao acessar a pasta frontend"; exit 1; }
  npm install
  npm run build
  cd ../..
else
  echo "Pasta 'frontend' não encontrada. Ignorando build do frontend."
fi

# --- Backend (Java/Quarkus) ---
echo "Construindo o backend Java..."
if [ -f "pom.xml" ]; then
  ./mvnw clean package -DskipTests
else
  echo "Arquivo 'pom.xml' não encontrado. Build do backend abortado."
  exit 1
fi

echo "Build concluído com sucesso!"