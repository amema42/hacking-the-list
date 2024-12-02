import { config } from 'dotenv'; // Per caricare variabili di ambiente
import { drizzle } from 'drizzle-orm/postgres-js'; // Drizzle ORM
import { migrate } from 'drizzle-orm/postgres-js/migrator'; // Migratore di Drizzle
import postgres from 'postgres'; // Libreria per la connessione a Postgres

// Carica il file .env.local in modalità non-production
if (process.env.NODE_ENV !== 'production') {
  config({
    path: '.env.local',
  });
}

// Verifica che POSTGRES_URL sia definita
if (!process.env.POSTGRES_URL) {
  throw new Error('❌ POSTGRES_URL is not defined in your environment variables.');
}

console.log('ℹ️ POSTGRES_URL:', process.env.POSTGRES_URL);

const runMigrate = async () => {
  try {
    // Configura la connessione a Postgres
    const connection = postgres(process.env.POSTGRES_URL, { max: 1 }); // Limita le connessioni
    const db = drizzle(connection); // Crea un'istanza Drizzle

    console.log('⏳ Running migrations...');

    const start = Date.now();
    await migrate(db, { migrationsFolder: './lib/db/migrations' }); // Esegui le migrazioni
    const end = Date.now();

    console.log('✅ Migrations completed in', end - start, 'ms');
    process.exit(0); // Esci con successo
  } catch (error) {
    console.error('❌ Migration failed');
    console.error(error);
    process.exit(1); // Esci con errore
  }
};

runMigrate();
