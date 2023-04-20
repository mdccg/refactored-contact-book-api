const requestOptions: Partial<Cypress.RequestOptions> = {
  method: 'POST',
  url: '/contacts',
  failOnStatusCode: false,
};

var fixtures = new Map<string, any>();

describe('Tests over /contacts path', () => {
  before(() => {
    const fixturesNames: string[] = [
      'contact',
      'invalidBirthdayContact',
      'invalidEmailContact',
      'invalidNameContact',
      'invalidPhoneContact'
    ];

    fixturesNames.forEach((fixtureName: string) => {
      cy.fixture(fixtureName).then((fixture: any) => {
        this.fixtures.set(fixtureName, fixture);
      });
    });
  });

  beforeEach(() => cy.task('clearContacts'));

  it('should save a valid contact', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures['contact'];

    cy.log(JSON.stringify(requestOptions));
    expect(true).to.equal(!false);

    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(201);
        const { contact } = body;
        expect(contact._id).to.not.null;
      });
  });

  it('should not save a contact with invalid birthday', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures['invalidBirthdayContact'];
  
    cy.log(JSON.stringify(requestOptions));
    expect(true).to.equal(!false);

    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Birthday must be previous to today');
      });
  });

  it('should not save a contact with invalid email', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures['invalidEmailContact'];
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Invalid email');
      });
  });

  it('should not save a contact with invalid name', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures['invalidNameContact'];
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Name cannot be empty');
      });
  });

  it('should not save a contact with invalid phone', () => {
    requestOptions.body = <Cypress.RequestBody>this.fixtures['invalidPhoneContact'];
  
    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(400);
        const { errorMessages } = body;
        expect(errorMessages[0]).to.equal('Phone must have following pattern: (00) 00000-0000');
      });
  });
});