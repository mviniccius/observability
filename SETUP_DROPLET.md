# Setup no Droplet (Digital Ocean)

Siga essa ordem exata. Se tiver dúvida, chama.

---

## 1. Pré-requisitos — instalar uma vez só

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (gerenciador de processo da API)
sudo npm install -g pm2

# Docker + Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin

# Adicionar seu usuário ao grupo docker (evita precisar de sudo toda hora)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 2. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO> observability
cd observability
```

---

## 3. Configurar variáveis do backend

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

O arquivo vai abrir assim — só confirma se está certo (pode deixar tudo como está):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=observability
DB_USER=postgres
DB_PASSWORD=postgres
```

Salva com `Ctrl+O`, `Enter`, `Ctrl+X`.

---

## 4. Subir banco de dados + Prometheus + Grafana

```bash
# Na raiz do projeto (onde está o docker-compose.yml)
docker compose up -d
```

Aguarda uns 30 segundos e verifica se subiu:

```bash
docker compose ps
```

Todos devem aparecer com status **running**.

---

## 5. Instalar dependências e subir a API com PM2

```bash
cd backend
npm install
pm2 start ecosystem.config.js
cd ..
```

Verifica se a API está rodando:

```bash
pm2 status
# deve aparecer "observability-api" com status "online"
```

Testa no próprio terminal:

```bash
curl http://localhost:3000/health
# deve retornar: {"status":"ok","timestamp":"..."}
```

Salva o PM2 para reiniciar automaticamente se o servidor reiniciar:

```bash
pm2 save
pm2 startup
# Copia e cola o comando que aparecer na tela
```

---

## 6. Abrir as portas no firewall

```bash
sudo ufw allow 3000   # API
sudo ufw allow 3001   # Grafana
sudo ufw allow 9090   # Prometheus
sudo ufw allow 22     # SSH (IMPORTANTE — não feche isso!)
sudo ufw enable
sudo ufw status
```

---

## 7. Descobrir o IP do Droplet

```bash
curl -s ifconfig.me
```

Anota esse IP — vai ser necessário configurar o front-end na Vercel.

---

## 8. Verificar tudo funcionando

| Serviço     | URL                          | Login         |
|-------------|------------------------------|---------------|
| API         | `http://IP:3000/health`      | sem login     |
| Métricas    | `http://IP:3000/metrics`     | sem login     |
| Prometheus  | `http://IP:9090`             | sem login     |
| Grafana     | `http://IP:3001`             | admin / admin |

No Grafana, após logar:
- Vai em **Dashboards** no menu lateral
- O dashboard **"Observabilidade da API"** já deve aparecer pré-configurado
- Se pedir para trocar senha, troca para algo que lembre

---

## 9. Configurar o front-end na Vercel

No painel da Vercel, nas configurações do projeto, adicionar as variáveis de ambiente:

```
NEXT_PUBLIC_API_URL=http://IP_DO_DROPLET:3000
NEXT_PUBLIC_GRAFANA_URL=http://IP_DO_DROPLET:3001
```

Substitui `IP_DO_DROPLET` pelo IP do passo 7.

Depois clica em **Redeploy** para as variáveis entrarem em vigor.

---

## Comandos úteis do dia a dia

```bash
# Ver logs da API em tempo real
pm2 logs observability-api

# Reiniciar a API (depois de atualizar código)
pm2 restart observability-api

# Parar tudo do Docker
docker compose down

# Subir tudo do Docker novamente
docker compose up -d

# Ver status geral
pm2 status && docker compose ps
```

---

## Portas usadas no Droplet

| Porta | Serviço     |
|-------|-------------|
| 3000  | API Node.js |
| 3001  | Grafana     |
| 5432  | PostgreSQL  |
| 9090  | Prometheus  |
