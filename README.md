# 💸 Projeto de Finanças Pessoais

Aplicação full stack para gestão financeira pessoal, com foco em planejamento de compras futuras, controle de contas e acompanhamento via dashboard intuitivo.

---

## 🚀 Funcionalidades

- Cadastro de futuras compras para planejamento financeiro.
- Listagem detalhada de contas por usuário.
- Dashboard com visualização de pagamentos realizados, não realizados e futuros.
- Float dinâmico para alertar sobre pagamentos em atraso, com modal para detalhes das contas pendentes.
- Autenticação segura via Keycloak, com criação automática do usuário no realm.

---

## 🛠 Tecnologias Utilizadas

<p align="left">
  <img alt="Java" src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img alt="Quarkus" src="https://img.shields.io/badge/Quarkus-8E0F00?style=for-the-badge&logo=quarkus&logoColor=white" />
  <img alt="Keycloak" src="https://img.shields.io/badge/Keycloak-DF0000?style=for-the-badge&logo=keycloak&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Lucide React" src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=react&logoColor=white" />
</p>

---

## 🔧 Como executar
1 - Inicie os containers Docker (backend + keycloak + banco)

```bash
docker-compose up -d
```
2 - Execute o frontend React
```bash
cd frontend/frontend-payments
npm install
npm start
```




