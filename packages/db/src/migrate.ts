import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDBConnectionString } from './connection';

const dbConnectionString = getDBConnectionString();
const migrationClient = postgres(dbConnectionString, {
  max: 1,
});
console.log('Running migrations...');
migrate(drizzle(migrationClient), {
  migrationsFolder: 'src/migrations',
})
  .then(() => {
    console.log('Migrations finished!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Migrations failed!', err);
    process.exit(1);
  });
