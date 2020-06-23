/* eslint-disable no-magic-numbers */

describe('Create account using seed phrase', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('go to account recovery screen on get started', () => {
    cy.get('.get-started-btn').click();

    cy.get('.recoveryPhrase [type="radio"]').not('[disabled]')
      .check({ force: true });

    cy.get('.q-btn').eq(1).click();
    const seedArray = [];
    cy.get('.word-span').each(($seed) => {
      seedArray.push($seed.text().replace(/[^a-z]/ig, ''));
    });

    cy.get('.q-btn').eq(2).click();
    cy.get('.q-card__actions > .q-btn').eq(1).click();

    cy.wrap(seedArray).each((word) => {
      cy.get('.randomSeedContainer').contains(word).click();
    });

    const pin = new Array(6);
    cy.wrap(pin).each(() => {
      cy.contains(0).click();
    });

    cy.get('.btns-wrapper > .q-btn').eq(1).click();

    cy.wrap(pin).each(() => {
      cy.contains(0).click();
    });

    cy.get('.btns-wrapper > .q-btn').eq(1).click();

    cy.get('.q-field__native').type('Test');
    cy.get('.btns-wrapper > .q-btn').eq(0).click();
    cy.get('.scroll-start > :nth-child(1) > .q-btn > .q-btn__wrapper').click();
    cy.get(':nth-child(1) > .account-item > .q-slide-item > .q-slide-item__content > .q-item > :nth-child(3) > .q-toggle').click();
    cy.get('.q-dialog__inner > :nth-child(1) > .header-section > .header-back-button-wrapper > .q-btn');
  });
});
