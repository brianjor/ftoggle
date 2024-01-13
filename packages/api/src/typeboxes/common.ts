import { TSchema, t } from 'elysia';

export const DataContract = <T extends TSchema>(data: T) =>
  t.Object({
    data,
  });
