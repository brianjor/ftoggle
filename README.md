# ftoggle

ftoggle is a feature toggle management tool.

## Development Setup

- Install [bun](https://bun.sh/)
- Run `bun run setup`

Optional Dependencies:

- [Docker](https://www.docker.com/)

### With Docker

- Go into the UI and DB packages folders and create an `.env` file copied from the `example.env`
- From project root run: `docker compose up`
- Access the Postgres database and create a database named: `ftoggle`
- From a separate terminal: `cd ./packages/db` & `bun run migrations:run`
- Access UI at `localhost:4200`, Default User:Pass - `Admin`:`FToggle`
- Access API at `localhost:8080`, `/swagger` for docs

### Without Docker

- [Database setup](./packages/db/README.md)
- [API Setup](./packages/api/README.md)
- [UI Setup](./packages/ui/README.md)
