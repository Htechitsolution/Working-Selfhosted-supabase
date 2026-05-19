# ⚡ Supabase Docker Self-Hosting Setup

A high-performance, minimal, and fully-featured Docker Compose setup for hosting your own **Supabase** instance locally or in production.

---

## 🚀 Quick Start

### 1. Configure Environment Variables
Copy the template env file and customize it with your own credentials, secrets, and custom ports:
```bash
cp .env.example .env
```

> [!IMPORTANT]  
> Make sure to update the placeholder passwords and JWT secret keys in `.env` before running in production to ensure your services remain secure.

### 2. Launch the Stack
Run Docker Compose to start all Supabase services:
```bash
docker compose up -d
```

### 3. Verify services
Once launched, you can access the following dashboards and API endpoints:
- **Supabase Studio Dashboard**: [http://localhost:3000](http://localhost:3000)
- **REST API (Kong Gateway)**: [http://localhost:8055](http://localhost:8055)
- **Local Analytics (Logflare)**: [http://localhost:4000](http://localhost:4000)

---

## 🛠️ Configuration & Troubleshooting

### ⚠️ Kong Gateway Permission Failures
If you encounter permission issues when launching the Kong service, or if the `supabase-kong` container fails to start with access/permission-denied errors:

1. Open `docker-compose.yml`.
2. Locate the `kong` service configuration block.
3. **Uncomment line 51** to run the container as the root user:
   ```yaml
   # docker-compose.yml (line 51)
   kong:
     ...
     restart: unless-stopped
     user: root # <-- Uncomment this line if Kong fails due to permissions
     ports:
       ...
   ```
4. Restart your stack:
   ```bash
   docker compose down && docker compose up -d
   ```

### 🔑 Default Credentials & Admin Panels
* **Studio Default Project**: *Default Project*
* **Studio Default Org**: *Default Org*
* **API Key / Postgres access**: Port `5432` (or configured `POSTGRES_PORT` in `.env`)
* **API Gateway Port**: `8055` (configured `KONG_HTTP_PORT` in `.env`)

---

## 📦 Services Included

This standard deployment packages the following microservices under a unified stack:
* **Studio** (`supabase/studio`): An awesome admin console for managing your databases and APIs.
* **Kong** (`kong`): The API gateway routing traffic to all edge services.
* **GoTrue / Auth** (`supabase/gotrue`): User authorization and authentication.
* **PostgREST / Rest** (`postgrest/postgrest`): Automatically transforms your database schema into a RESTful API.
* **Realtime** (`supabase/realtime`): Listens to database changes and broadcasts them over WebSockets.
* **Storage** (`supabase/storage-api`): S3-compatible file storage service.
* **PostgreSQL Database** (`supabase/postgres`): Highly optimized PostgreSQL database pre-bundled with standard extensions like `pgvector`, `pgsodium`, etc.
* **Supavisor** (`supabase/supavisor`): A cloud-native connection pooler for Postgres.
* **Logflare / Analytics** (`supabase/logflare`): Event logging and monitoring.
