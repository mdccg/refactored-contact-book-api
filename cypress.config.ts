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
  startDate: Date;
  endDate: Date;
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

        async populateContacts({ lastname, populationSize, startDate, endDate }: PopulateType) {
          // Definindo valores padrão
          const size = populationSize > 1    ? populationSize : 2;
          const contactLastName = lastname   ? lastname : faker.name.lastName();
          const contactStartDate = startDate ? startDate : new Date('2001-11-27');
          const contactEndDate = endDate     ? endDate : new Date('2001-11-27');

          for (let i = 0; i < size; ++i) {
            const isItInFirstHalf = i < size / 2;
            
            const name = isItInFirstHalf ? faker.name.fullName({ lastName: contactLastName }) : faker.name.fullName();
            const email = faker.internet.email(name);
            const phone = faker.phone.number('(##) 9####-####');
            const birthday = isItInFirstHalf ? faker.date.between(contactStartDate, contactEndDate) : faker.date.birthdate();

            const contact = new ContactModel({ name, email, phone, birthday });

            await db?.collection('contacts').insertOne(contact);
          }

          return null;
        }
      });
    },
  },
  video: false,
});
