import { defineConfig } from 'cypress';
import { Db, MongoClient } from 'mongodb';
import { ContactModel } from './src/domains/ContactModel';
import { faker } from '@faker-js/faker';

const DB_NAME = 'contactbook_test';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;
let db: Db | null = null;
const POPULATION_SIZE = 100;

// Clojure
(async () => {
  const connection = await MongoClient.connect(DB_URL);
  db = connection.db(DB_NAME);
})();

type PopulateType = {
  lastname: string;
  populationSize: number;
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      on('task', {
        async clearContacts() {
          await db?.collection('contacts').deleteMany({});
          return null;
        },

        async populateContacts({ lastname, populationSize }: PopulateType) {
          const size = populationSize < 2 ? 2 : populationSize;
          const lastName = !lastname ? faker.name.lastName() : lastname;

          for (let i = 0; i < size; ++i) {
            const options = i < size / 2 ? { lastName } : undefined;
            const name = faker.name.fullName(options);

            const contact = new ContactModel({
              name,
              email: faker.internet.email(name),
              phone: faker.phone.number('(##) 9####-####'),
              birthday: faker.date.birthdate({ min: 18, max: 60 }),
            });

            await db?.collection('contacts').insertOne(contact);
          }

          return null;
        }
      });
    },
  },
  video: false,
});
