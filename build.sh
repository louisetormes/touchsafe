#!/bin/bash

set -euo pipefail

## --- Correção do ambiente básico ---
export TERM=xterm
export COLORTERM=truecolor

## --- Instalação do Java Portable ---
echo "🛠️ Configurando Java..."
JAVA_HOME="/tmp/jdk-21"
if [ ! -d "$JAVA_HOME" ]; then
  echo "📦 Baixando JDK 21..."
  mkdir -p "$JAVA_HOME"
  wget -q "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz" -O /tmp/jdk.tar.gz
  tar -xzf /tmp/jdk.tar.gz -C "$JAVA_HOME" --strip-components=1
fi
export PATH="$JAVA_HOME/bin:$PATH"

## --- Frontend (React/Vite) ---
echo "🔨 Construindo frontend..."
if [ -d "frontend" ]; then
  cd frontend/frontend-payments
  npm install --silent
  npm run build
  cd ../..
else
  echo "⚠️ Pasta frontend não encontrada"
fi

## --- Backend (Java/Quarkus) ---
echo "🔧 Construindo backend..."
if [ -f "pom.xml" ]; then
  export MAVEN_OPTS="-Dmaven.repo.local=/tmp/m2/repository"
  export MAVEN_CLI_OPTS="-B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn"
  
  chmod +x mvnw
  ./mvnw clean package -DskipTests $MAVEN_CLI_OPTS
  
  # Verificação rigorosa
  if [ ! -f "target/quarkus-app/quarkus-run.jar" ]; then
    echo "❌ ERRO: Build falhou - JAR não gerado!"
    exit 1
  fi
else
  echo "❌ Arquivo pom.xml não encontrado!"
  exit 1
fi

echo "✅ Build concluído com sucesso!"