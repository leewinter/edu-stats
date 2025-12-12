# API Service (apps/api)

Stage: clean architecture + database readiness

This folder now contains the multi-project ASP.NET Core solution (`EduStats.sln`) with Domain/Application/Infrastructure/API layers plus a `EduStats.Migrator` console app. The API exposes an `/api/institutions` endpoint powered by MediatR + FluentValidation, Infrastructure wires EF Core with PostgreSQL + generic repository/unit-of-work services, and the migrator applies EF Core migrations + seed data.

## Todo
- [x] Initialize solution + projects
- [x] Configure EF Core with PostgreSQL provider
- [x] Add base repository + unit of work pattern
- [ ] Scaffold CQRS + event publishing integration
- [x] Add EF Core migrations + seed scripts
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

## Database migrations & seed data

- Add a new migration:
  ```bash
  cd apps/api
  dotnet ef migrations add <Name> --project src/EduStats.Infrastructure --startup-project src/EduStats.Api --output-dir Persistence/Migrations
  ```
- Apply migrations + built-in seed data locally (requires Postgres on `localhost:5432`):
  ```bash
  cd apps/api
  dotnet run --project src/EduStats.Migrator
  ```
- Through Docker Compose:
  ```bash
  docker compose run --rm --profile migrate migrator
  ```
- The API can auto-run migrations when the `Database__RunMigrationsOnStartup=true` environment variable is provided (Compose sets this). This path uses the same seed routine defined in `SeedData`.
