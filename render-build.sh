#!/bin/bash
set -euo pipefail

# 1. Preserva a PATH original do Render
export RENDER_ORIGINAL_PATH=$PATH

# 2. Configuração do ambiente (sem quebrar o sistema de cores)
export JAVA_HOME="/tmp/jdk-21"
export PATH="$JAVA_HOME/bin:$RENDER_ORIGINAL_PATH"  # Adiciona ao PATH existente

# 3. Instala Java (versão do seu .tool-versions)
echo "🔧 Instalando Java..."
mkdir -p "$JAVA_HOME"
wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -O /tmp/jdk.tar.gz
tar -xzf /tmp/jdk.tar.gz -C "$JAVA_HOME" --strip-components=1

# 4. Build do projeto (seu comando original)
echo "🚀 Iniciando build..."
chmod +x build.sh
./build.sh

echo "✅ Build completo!"