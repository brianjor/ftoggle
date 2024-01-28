import { FToggle } from '@ftoggle/clients/bun';
import { Elysia } from 'elysia';

const ftoggle = new FToggle({
  baseUrl: 'localhost:8080',
  apiToken: 'testId:dev:dc603a94-f649-425b-a452-0ed27ceae84e',
  refreshInterval: 5,
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
