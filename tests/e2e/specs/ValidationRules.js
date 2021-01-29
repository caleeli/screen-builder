
describe('Record list', () => {

  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Invalid default values', () => {
    cy.loadFromJson('validation_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]').parent().should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]').parent().should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]').parent().should('contain.text', 'Invalid value');

    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('on');
    cy.get('[data-cy=preview-content] [name=form_input_2]').type('2');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]').parent().should('not.contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]').parent().should('not.contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]').parent().should('not.contain.text', 'Invalid value');
  });
});
