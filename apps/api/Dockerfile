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
RUN dotnet restore
COPY . .
WORKDIR /src/src/EduStats.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "EduStats.Api.dll"]
