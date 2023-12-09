import Elysia, { Context, t } from "elysia";

const port = Bun.env.API_PORT ?? 8080;
const app = new Elysia();

type HelloRequestContext = Context<{
  query: {
    name?: string;
  };
  response: string;
}>;

const HelloRequestSchema = {
  query: t.Object({
    name: t.Optional(t.String()),
  }),
  response: {
    200: t.String(),
  },
};

app.get(
  "/hello",
  ({ query }: HelloRequestContext) => {
    return `Hello ${query.name}`;
  },
  HelloRequestSchema
);

app.listen(port, () => {
  console.log(
    `Started server on http://${app.server?.hostname}:${app.server?.port}`
  );
});
