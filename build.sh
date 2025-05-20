#!/bin/bash

set -euo pipefail

echo "Configurando ambiente..."
apt-get update || true
apt-get install -y --no-install-recommends ncurses-bin || echo "Ignorando falha na instalação de ncurses"

# --- Configura Java ---
echo "Configurando Java..."
if ! command -v java &> /dev/null; then
  echo "Instalando Temurin JDK 21..."
  JAVA_DIR="/tmp/jdk-21"
  mkdir -p "$JAVA_DIR"
  wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -O /tmp/jdk.tar.gz
  tar -xzf /tmp/jdk.tar.gz -C "$JAVA_DIR" --strip-components=1
  export JAVA_HOME="$JAVA_DIR"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

# --- Frontend (React/Vite) ---
echo "Construindo frontend React..."
if [ -d "frontend" ]; then
  cd frontend/frontend-payments || { echo "Falha ao acessar frontend"; exit 1; }
  
  # Configura Node.js seguro
  export NODE_ENV=production
  
  echo "Instalando dependências do frontend..."
  npm install --prefer-offline --no-audit
  
  echo "Build do frontend..."
  npm run build
  cd ../..
else
  echo "Pasta frontend não encontrada, pulando..."
fi

# --- Backend (Java/Quarkus) ---
echo "Construindo backend Java..."
if [ -f "pom.xml" ]; then
  MAVEN_OPTS="-Dmaven.repo.local=/tmp/m2/repository -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn"
  export MAVEN_OPTS
  
  echo "Executando Maven Wrapper..."
  chmod +x mvnw
  ./mvnw clean package -DskipTests -B -V
  
  if [ ! -f "target/quarkus-app/quarkus-run.jar" ]; then
    echo "ERRO: Build do Quarkus falhou - JAR não encontrado!"
    find target/ -type f
    exit 1
  fi
else
  echo "Arquivo pom.xml não encontrado!"
  exit 1
fi

echo "Build concluído com sucesso!"