FROM node:22-alpine AS base
WORKDIR /workspace

# Install UI dependencies
COPY packages/ui/package.json packages/ui/package-lock.json ./packages/ui/
RUN cd packages/ui && npm install

# Install web dependencies
COPY apps/web/package.json apps/web/package-lock.json ./apps/web/
RUN cd apps/web && npm install

# Copy source
COPY apps ./apps
COPY packages ./packages

# Build shared UI library so the dev server can import compiled artifacts if needed
RUN cd packages/ui && npm run build

WORKDIR /workspace/apps/web
ENV VITE_API_BASE_URL=http://localhost:8080/api
EXPOSE 4173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4173"]
