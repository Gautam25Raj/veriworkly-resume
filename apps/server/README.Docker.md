## 🐳 Docker (Backend Note)

Docker orchestration is managed at the **repository root** using the shared `compose.yaml`.

The backend (`server/`) is included as part of the `api` service and should **not be started independently** via Docker.

---

### 🚀 Run from Root

```bash
docker compose --env-file .env.docker up -d --build
```

---

### 📖 Full Documentation

For complete setup instructions, environment configuration, and production notes, refer to:

👉 `README.Docker.md` (root directory)

---

### ⚠️ Notes

- Do **not** run Docker commands from the `server/` directory
- Environment variables are managed via:
  - `.env.example` (root)
  - `.env.docker` (root)

- The backend is automatically built and started as part of the `api` service

### 📤 Export Artifact Provider in Containers

- When using `EXPORT_ARTIFACT_PROVIDER=local`, ensure the artifact directory is backed by a writable volume.
- When using `EXPORT_ARTIFACT_PROVIDER=oci`, set all `EXPORT_ARTIFACT_OCI_*` variables in your Docker env file and prefer OCI lifecycle rules for cleanup.
