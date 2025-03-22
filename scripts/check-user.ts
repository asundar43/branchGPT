import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '@/lib/db/schema';
import { config } from 'dotenv';

config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function main() {
  try {
    const users = await db.select().from(user);
    console.log('All users:', users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main().catch(console.error); 