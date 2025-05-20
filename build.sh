#!/bin/bash

export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# --- Frontend (React/Vite) ---
echo "Construindo o frontend React..."
if [ -d "frontend" ]; then
  cd frontend/fronted-payments || { echo "Falha ao acessar a pasta frontend"; exit 1; }
  npm install
  npm run build
  cd ../..
else
  echo "Pasta 'frontend' não encontrada. Ignorando build do frontend."
fi

# --- Backend (Java/Quarkus) ---
echo "Construindo o backend Java..."
if [ -f "pom.xml" ]; then
  if ! command -v java &> /dev/null; then
    echo "Java não encontrado. Tentando instalar..."
    wget https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz
    tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -C /tmp
    export JAVA_HOME=/tmp/jdk-21.0.3+9
    export PATH=$JAVA_HOME/bin:$PATH
  fi
  
  chmod +x mvnw
  ./mvnw clean package -DskipTests
  
  if [ ! -f "target/quarkus-app/quarkus-run.jar" ]; then
    echo "Erro: Arquivo JAR não foi gerado!"
    exit 1
  fi
else
  echo "Arquivo 'pom.xml' não encontrado. Build do backend abortado."
  exit 1
fi

echo "Build concluído com sucesso!"