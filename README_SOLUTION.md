# README_SOLUTION

## Overview

This document provides an overview of the solutions and steps implemented to address the requirements of the project, including setting up a mock server, modifying endpoints, and containerizing the application for seamless deployment and usage.

---

## Project Structure

The project now contains two main servers:

1. **Simulation Server** - Responsible for the core application logic and endpoints specified in the task.
2. **Mock Server** - Serves mock data for the simulation server to interact with.

### Updated File Structure:

- `src/`
  - `index.ts` - Main simulation server entry point.
  - `server.ts` - Mock server implementation.
  - `controllers/` - Contains logic for endpoints.
  - `api/` - Handles API requests to the mock server.
- `dist/` - Contains the compiled output.
- `docker-compose.yml` - Defines the containerization configuration.
- `Dockerfile` - Builds the simulation server container.
- `tsconfig.build.json` - TypeScript build configuration.

---

## Script Updates

New and updated scripts in `package.json`:

```json
"scripts": {
  "start": "node dist/index.js",
  "build": "tsc --project tsconfig.build.json",
  "test": "vitest run --coverage",
  "mock-server": "node dist/server.js",
  "start-all": "npm-run-all --parallel start mock-server"
}
```

### Usage:

- `npm run build`: Compiles the TypeScript source files.
- `npm run start`: Starts the simulation server.
- `npm run mock-server`: Starts the mock server.
- `npm run start-all`: Starts both the simulation and mock servers simultaneously.

---

## Endpoint Changes

The mock server now serves two endpoints as per the specification:

- **GET /state**: Returns simulation state.
- **GET /mappings**: Returns mapping data.

Updated API calls in `src/api/simulatorApi.ts`:

```typescript
const MOCK_SERVER_URL = process.env.MOCK_SERVER_URL || "http://localhost:4000";

const response = await axios.get<StateResponse>(`${MOCK_SERVER_URL}/state`);
const response = await axios.get<MappingsResponse>(
  `${MOCK_SERVER_URL}/mappings`
);
```

---

## Containerization

The application has been containerized using Docker.

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start-all"]
EXPOSE 3000 4000
```

### docker-compose.yml

```yaml
version: "3.9"
services:
  simulation:
    build: .
    ports:
      - "3000:3000"
  mock-server:
    build: .
    command: npm run mock-server
    ports:
      - "4000:4000"
```

### Steps to Run

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. Access endpoints:
   - Simulation Server: `http://localhost:3000`
   - Mock Server: `http://localhost:4000`

---

## Future Improvements

- **Testing:** Add integration tests for both servers to ensure proper communication.
- **Error Handling:** Enhance error handling for API failures.
- **Scalability:** Consider separating mock server and simulation server into independent repositories for larger projects.

---

This solution ensures modularity, scalability, and ease of use for both development and deployment.
