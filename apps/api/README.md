# API Service (apps/api)

Stage: clean architecture scaffold

This folder now contains the multi-project ASP.NET Core solution (`EduStats.sln`) with Domain/Application/Infrastructure/API layers. The API exposes an `/api/institutions` endpoint powered by MediatR + FluentValidation, and Infrastructure wires EF Core with PostgreSQL plus generic repository + unit of work services. Docker builds are handled via `apps/api/Dockerfile`.

## Todo
- [x] Initialize solution + projects
- [x] Configure EF Core with PostgreSQL provider
- [x] Add base repository + unit of work pattern
- [ ] Scaffold CQRS + event publishing integration
- [ ] Add EF Core migrations + seed scripts
- [ ] Write README updates when milestones are completed

## Local development

```bash
cd apps/api
dotnet build
dotnet run --project src/EduStats.Api
```

Environment expectations:

- `ConnectionStrings__Main` must point to the Postgres container (Compose sets this automatically).
- Ports: API listens on `8080` inside containers, `http://localhost:8080` outside Compose.
- Health endpoint: `GET /health`.
