import { FToggle } from '@ftoggle/clients-bun';
import { Elysia } from 'elysia';

const ftoggle = new FToggle({
  baseUrl: 'localhost:8080',
  apiToken: 'tp1:dev:13f614c1-be4f-4c9c-95e1-e34f0389279b',
  refreshInterval: 5,
  context: {
    asd: ['asd'],
  },
});

const app = new Elysia();

app.get('/demo', () => {
  if (ftoggle.isEnabled('feature')) {
    return { data: 'Hello' };
  }
  return { data: 'Not enabled' };
});

app.listen({ port: 8081 }, () =>
  console.log(`Demo Api listening on ${app.server?.url}`),
);
