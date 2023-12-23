import cors from '@elysiajs/cors';
import Elysia from 'elysia';
import { errorHook } from './hooks/errorHook';
import { routes } from './router';

const port = Bun.env.API_PORT ?? 8080;
const app = new Elysia()
  .use(cors())
  .onError(errorHook)
  .use(routes)
  .listen(port, (server) => {
    console.log(`Started server on http://${server?.hostname}:${server?.port}`);
  });

export type App = typeof app;
