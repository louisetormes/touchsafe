#!/bin/bash

# --- Instala dependências específicas ---
echo "Instalando Temurin JDK 21.0.7 e Maven 3.8.6..."

# Adiciona repositório do Temurin (JDK 21)
apt-get update && apt-get install -y wget
wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add -
echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list
apt-get update && apt-get install -y temurin-21-jdk

# Instala Maven 3.8.6
wget https://archive.apache.org/dist/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz
tar -xzf apache-maven-3.8.6-bin.tar.gz -C /opt/
ln -s /opt/apache-maven-3.8.6/bin/mvn /usr/bin/mvn

# Instala Node.js (para o frontend)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verifica versões
echo "Versões instaladas:"
java -version
mvn -v
npm -v

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
  mvn clean package
else
  echo "Arquivo 'pom.xml' não encontrado. Build do backend abortado."
  exit 1
fi

echo "Build concluído com sucesso!"