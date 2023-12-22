import cors from '@elysiajs/cors';
import Elysia from 'elysia';
import { errorHook } from './hooks/errorHook';
import { Router } from './router';

const port = Bun.env.API_PORT ?? 8080;
const app = new Elysia();
app.use(cors());

app.onError(errorHook);

Router.route(app);

app.listen(port, () => {
  console.log(
    `Started server on http://${app.server?.hostname}:${app.server?.port}`,
  );
});

export type App = typeof app;
