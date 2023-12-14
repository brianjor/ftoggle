import Elysia from 'elysia';
import { Router } from './router';
import { errorHook } from './hooks/errorHook';

const port = Bun.env.API_PORT ?? 8080;
const app = new Elysia();

app.onError(errorHook);

Router.route(app);

app.listen(port, () => {
  console.log(
    `Started server on http://${app.server?.hostname}:${app.server?.port}`,
  );
});

export type App = typeof app;
