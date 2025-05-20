#!/bin/bash
set -euo pipefail

# 1. Instala Java 21 (Temurin)
echo "🔧 Instalando Java 21..."
JAVA_DIR="/tmp/jdk-21"
mkdir -p "$JAVA_DIR"
wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -O /tmp/jdk.tar.gz
tar -xzf /tmp/jdk.tar.gz -C "$JAVA_DIR" --strip-components=1
export JAVA_HOME="$JAVA_DIR"
export PATH="$JAVA_HOME/bin:$PATH"

# 2. Instala Node.js 
echo "📦 Instalando Node.js..."
NODE_VERSION=$(grep 'nodejs' .tool-versions | cut -d' ' -f2)
curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
export PATH="/root/.local/share/fnm:$PATH"
fnm install $NODE_VERSION
fnm use $NODE_VERSION

# 3. Build do Frontend
echo "🎨 Build do frontend..."
[ -d "frontend" ] && {
  cd frontend/frontend-payments
  npm install
  npm run build
  cd ../..
}

# 4. Build do Backend 
echo "⚙️ Build do backend..."
[ -f "pom.xml" ] && {
  chmod +x mvnw
  ./mvnw clean package -DskipTests
}

echo "✅ Build completo!"