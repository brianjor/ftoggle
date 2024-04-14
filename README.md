# ftoggle

ftoggle is a feature toggle management tool.

## Development Setup

### Requirements

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

### Setup

- From project root:
  - `bun run setup`
  - `docker compose up`
- From a separate terminal: `cd ./packages/db` & `bun run migrations:run`

### Access

- Access DB at `localhost:5432`, default user:pass - `postgres`:`dev`
- Access UI at `localhost:4200`, default user:pass - `Admin`:`FToggle`
- Access API at `localhost:8080`, `/swagger` for docs

### Individual setups

- [Database setup](./packages/db/README.md)
- [API Setup](./packages/api/README.md)
- [UI Setup](./packages/ui/README.md)
