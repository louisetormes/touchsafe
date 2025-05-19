# ⚙️ Projeto de Autenticação com Keycloak 

Este projeto utiliza o **Keycloak** como provedor de identidade e gerenciador de autenticação, integrando usuários, clientes e roles com suporte a *Service Accounts* rodando em um microserviço com **Quarkus**.

## 📂 Upload do Realm

A pasta `upload-realm` contém o JSON de configuração do **realm `auth-keycloak-realm`**, que pode ser importado diretamente no Keycloak. Esse arquivo define:

- 🔑 O cliente `auth-keycloak`
- 🛡️ A role `AUTH-KEYCLOAK` associada ao cliente
- 👤 O usuário `teste` com a role atribuída via *client role*
- ⚙️ Outras configurações úteis (redirect URIs, protocolos, etc.)

<br/>

### 🔁 Como importar

Você pode importar o JSON manualmente via interface do Keycloak:

1. Acesse o painel administrativo do Keycloak.
2. Vá em **Realm Settings > Import**.
3. Selecione o arquivo `upload-realm/realm-export.json`.
4. Clique em **Create**.

Ou via terminal (container Docker):

```bash
docker cp upload-realm/realm-export.json <nome-do-container>:/opt/keycloak/data/import
docker exec -it <nome-do-container> /opt/keycloak/bin/kc.sh import --file=/opt/keycloak/data/import/realm-export.json --override
```

🧪 Tecnologias Utilizadas
Tecnologia	Versão	:rocket:
21.1.1	Gerenciador de autenticação e autorização
2.13.7.Final	Framework Java Leve e Nativo
21	Linguagem base
Latest	Containerização dos ambientes
15	Persistência do Keycloak
-	Protocolo de Autenticação

👤 Usuário de Teste
Usuário criado no realm para testes rápidos com roles atribuídas:

Usuário	Senha	Role
teste	testpass	AUTH-KEYCLOAK

<p align="center"> <img src="https://blog.desdelinux.net/wp-content/uploads/2019/08/KeyCloak-1.png.webp" width="120px"/> <img src="https://www.docker.com/wp-content/uploads/2022/03/Docker-Logo-White-RGB_Vertical.png" width="120px"/> <img src="[https://quarkus.io/assets/images/logos/quarkus_icon_rgb_300px_reverse.png](https://media.licdn.com/dms/image/v2/D4D12AQE5q_oUHnksFw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1684257349831?e=2147483647&v=beta&t=KSla1oVS1YEwA-LRmJmYeNhCr3J90kF-nlgnrTqOrXI)" width="120px"/> </p>
