# API Service (apps/api)

Stage: CQRS write path + event publishing

This folder now contains the multi-project ASP.NET Core solution (`EduStats.sln`) with Domain/Application/Infrastructure/API layers plus a `EduStats.Migrator` console app. The API exposes `/api/institutions` query + command endpoints powered by MediatR + FluentValidation. Infrastructure wires EF Core with PostgreSQL, a generic repository/unit-of-work implementation, and a RabbitMQ publisher for CQRS events. The migrator applies EF Core migrations + seed data.

## Todo
- [x] Initialize solution + projects
- [x] Configure EF Core with PostgreSQL provider
- [x] Add base repository + unit of work pattern
- [x] Scaffold CQRS + event publishing integration
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
- `MessageBroker__HostName`, `__Port`, `__UserName`, `__Password`, `__VirtualHost` configure RabbitMQ (defaults match `docker-compose`).
- Ports: API listens on `8080` inside containers, `http://localhost:8080` outside Compose.
- Health endpoint: `GET /health`.

## CQRS + messaging

- **Queries**  
  `GET /api/institutions?pageNumber=1&pageSize=10`
- **Commands**  
  `POST /api/institutions` with body
  ```json
  {
    "name": "Contoso College",
    "enrollment": 12345,
    "addresses": [
      {
        "line1": "1 Example Way",
        "line2": null,
        "city": "Birmingham",
        "county": "West Midlands",
        "country": "UK",
        "postalCode": "B1 1AA"
      }
    ]
  }
  ```
  `PUT /api/institutions/{id}` with the same shape updates an existing record.
- Each successful command publishes an `InstitutionChangedEvent` to the RabbitMQ exchange `institutions` using routing keys `institutions.created` / `institutions.updated`. Consumers can bind queues to that exchange to react to mutations (no built-in consumer yet).

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
