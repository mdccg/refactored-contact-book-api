describe('Tests over /contacts path', () => {
  it('should save a valid contact', () => {
    const contact = {
      name: 'Matheusinho',
      email: 'matheus.gomes@estudante.ifms.edu.br',
      phone: '(67) 99222-4129',
      birthday: '2001-11-27'
    };

    const requestOptions: Partial<Cypress.RequestOptions> = {
      method: 'POST',
      url: '/contacts',
      body: contact
    };

    cy.request(requestOptions)
      .then(({ body, status }) => { 
        expect(status).to.equal(201);
        const { contact } = body;
        // const { name, email, phone, birthday } = contact;
        expect(contact._id).to.not.null;
      });
  });
});