#!/bin/bash

set -euo pipefail
export TERM=dumb
export DEBIAN_FRONTEND=noninteractive

echo "🔧 Configurando ambiente Java..."
JAVA_DIR="/tmp/jdk-21"
if [ ! -d "$JAVA_DIR" ]; then
  echo "📦 Baixando JDK 21..."
  mkdir -p "$JAVA_DIR"
  wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -O /tmp/jdk.tar.gz
  tar -xzf /tmp/jdk.tar.gz -C "$JAVA_DIR" --strip-components=1
fi
export JAVA_HOME="$JAVA_DIR"
export PATH="$JAVA_HOME/bin:$PATH"

echo "🛠️ Configurando Maven..."
MAVEN_HOME="/tmp/maven-3.8.6"
if [ ! -d "$MAVEN_HOME" ]; then
  echo "📦 Baixando Maven 3.8.6..."
  mkdir -p "$MAVEN_HOME"
  wget -q https://archive.apache.org/dist/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz -O /tmp/maven.tar.gz
  tar -xzf /tmp/maven.tar.gz -C "$MAVEN_HOME" --strip-components=1
fi
export PATH="$MAVEN_HOME/bin:$PATH"

# 4. Build do Frontend (React)
echo "🎨 Construindo frontend..."
[ -d "frontend" ] && {
  cd frontend/frontend-payments
  npm install --silent
  npm run build
  cd ../..
}

# 5. Build do Backend (Java)
echo "⚙️ Construindo backend..."
[ -f "pom.xml" ] && {
  mvn clean package -DskipTests -B -q
  echo "✅ Backend construído com sucesso!"
  ls -lh target/*.jar
}

echo "🚀 Build completo!"