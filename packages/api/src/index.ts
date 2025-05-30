import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';
import { errorHook } from './hooks/errorHook';
import { routes } from './routes';

const port = Bun.env.API_PORT ?? 8080;
const app = new Elysia()
  .use(cors())
  .use(swagger())
  .onError((context) => errorHook(context))
  .use(routes)
  .listen(port, (server) => {
    console.log(`Started server on http://${server?.hostname}:${server?.port}`);
  });

export type App = typeof app;
