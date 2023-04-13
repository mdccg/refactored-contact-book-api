import { defineConfig } from 'cypress';
import { Db, MongoClient } from 'mongodb';

const DB_NAME = 'contactbook_test';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;
let db: Db | null = null;

// Clojure
(async () => {
  const connection = await MongoClient.connect(DB_URL);
  db = connection.db(DB_NAME);
})();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      on('task', {
        async clearContacts() {
          await db?.collection('contacts').deleteMany({});
          return null;
        }
      });
    },
  },
  video: false,
});
