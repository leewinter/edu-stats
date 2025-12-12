FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY EduStats.sln ./
COPY src/EduStats.Domain/EduStats.Domain.csproj src/EduStats.Domain/
COPY src/EduStats.Application/EduStats.Application.csproj src/EduStats.Application/
COPY src/EduStats.Infrastructure/EduStats.Infrastructure.csproj src/EduStats.Infrastructure/
COPY src/EduStats.Api/EduStats.Api.csproj src/EduStats.Api/
COPY src/EduStats.Migrator/EduStats.Migrator.csproj src/EduStats.Migrator/
RUN dotnet restore
COPY . .
RUN dotnet publish src/EduStats.Api/EduStats.Api.csproj -c Release -o /app/publish/api /p:UseAppHost=false
RUN dotnet publish src/EduStats.Migrator/EduStats.Migrator.csproj -c Release -o /app/publish/migrator /p:UseAppHost=false

FROM base AS api
WORKDIR /app
COPY --from=build /app/publish/api .
ENTRYPOINT ["dotnet", "EduStats.Api.dll"]

FROM base AS migrator
WORKDIR /app
COPY --from=build /app/publish/migrator .
ENTRYPOINT ["dotnet", "EduStats.Migrator.dll"]
