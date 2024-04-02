import { FToggle } from '@ftoggle/clients-bun';
import { Elysia } from 'elysia';

const host = Bun.env.host ?? 'localhost';
const ftoggle = new FToggle({
  baseUrl: `${host}:8080`,
  apiToken: 'tp1:dev:c33b8bee-fdf3-4a75-9fe1-d3a1a9cffe92',
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
