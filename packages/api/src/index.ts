import Elysia from 'elysia';
import { Router } from './router';

const port = Bun.env.API_PORT ?? 8080;
const app = new Elysia();

Router.route(app);

app.listen(port, () => {
  console.log(
    `Started server on http://${app.server?.hostname}:${app.server?.port}`,
  );
});

export type App = typeof app;
