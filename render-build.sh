#!/bin/sh

PATH="/usr/local/bin:/usr/bin:/bin"

echo "Instalando Java..."
mkdir -p /tmp/jdk
wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -O /tmp/jdk.tar.gz
tar -xzf /tmp/jdk.tar.gz -C /tmp/jdk --strip-components=1
export JAVA_HOME="/tmp/jdk"
export PATH="$JAVA_HOME/bin:$PATH"

if [ -d "frontend" ]; then
  echo "Instalando Node.js..."
  curl -fsSL https://fnm.vercel.app/install | sh -s -- --skip-shell
  . /root/.local/share/fnm/fnm
  fnm use $(grep 'nodejs' .tool-versions | awk '{print $2}')
  export PATH="/root/.local/share/fnm:$PATH"
fi

echo "Iniciando build..."
chmod +x build.sh
./build.sh

echo "Build concluído com sucesso!"