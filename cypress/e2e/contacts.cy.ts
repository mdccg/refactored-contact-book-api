// Cadê meu log?
// > SOUSA, Sidney Roberto de

const requestOptions: Partial<Cypress.RequestOptions> = {
  method: 'POST',
  url: '/contacts',
  failOnStatusCode: false,
};

var fixtures: Map<string, any>;

describe('Tests over /contacts path', () => {
  before(() => {
    const fixturesNames: string[] = [
      'contact',
      'invalidBirthdayContact',
      'invalidEmailContact',
      'invalidNameContact',
      'invalidPhoneContact'
    ];

    this.fixtures = new Map<string, any>();

    fixturesNames.forEach((fixtureName: string) => {
      cy.fixture(fixtureName).then((fixture: any) => {
        this.fixtures.set(fixtureName, fixture);
      });
    });
  });

  beforeEach(() => cy.task('clearContacts'));

  it('should save a valid contact', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures.get('contact');

    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(201);
        const { contact } = body;
        expect(contact._id).to.not.null;
      });
  });

  it('should not save a contact with invalid birthday', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures.get('invalidBirthdayContact');
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Birthday must be previous to today');
      });
  });

  it('should not save a contact with invalid email', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures.get('invalidEmailContact');
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Invalid email');
      });
  });

  it('should not save a contact with invalid name', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures.get('invalidNameContact');
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Name cannot be empty');
      });
  });

  it('should not save a contact with invalid phone', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures.get('invalidPhoneContact');
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Phone must have following pattern: (00) 00000-0000');
      });
  });

  it('should find contacts by name', () => {
    const lastname = 'Sousa';
    const populationSize = 10;
    const params = { lastname, populationSize };

    cy.task('populateContacts', params);

    requestOptions.method = 'GET';
    requestOptions.url = `/contacts/name/${lastname}`;

    cy.request(requestOptions).then(({ body, status }) => {
      expect(status).to.equal(200);
      const { contacts }: { contacts: any[] } = body;
      expect(contacts.length).be.gte(populationSize / 2);
      contacts.forEach((contact: any) => expect(contact.name).to.contain(lastname));
    });
  });

  it('should retrieve correct contacts by birthday period', () => {
    const start = '2001-11-01';
    const end = '2001-11-30';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const populationSize = 10;
    const params = { startDate, endDate, populationSize };

    cy.task('populateContacts', params);

    requestOptions.method = 'GET';
    requestOptions.url = `/contacts/birthday/?start=${start}&end=${end}`;
    
    cy.request(requestOptions).then(({ body, status }) => {
      expect(status).to.equal(200);
      const { contacts }: { contacts: any[] } = body;
      expect(contacts.length).be.gte(populationSize / 2);
      contacts.forEach((contact: any) => {
        expect(new Date(contact.birthday)).to.gte(startDate);
        expect(new Date(contact.birthday)).to.lte(endDate);
      });
    });
  });
});