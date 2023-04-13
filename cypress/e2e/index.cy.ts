describe('Tests over API index', () => {
  it('should return welcome message', () => {
    const requestOptions: Partial<Cypress.RequestOptions> = {
      method: 'GET',
      url: '/'
    };

    cy.request(requestOptions)
      .then((response) => {
        const { body } = response;
        expect(body).to.equal('Contact Book API');
      });
  });
});