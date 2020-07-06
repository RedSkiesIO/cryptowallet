/* eslint-disable no-magic-numbers */
function login() {
  cy.wrap(new Array(6)).each((value, index) => {
    cy.contains(index).click();
  });
  cy.get('.bg-yellow > .q-btn__wrapper').click();
}


describe('Transactions', () => {
  beforeEach(() => {
    cy.fixture('testAccount').then((account) => {
      localStorage.setItem('vuex-orm-loki', JSON.stringify(account));
    });
    cy.visit('/');
  });


  it('send a transaction from an evm chain', () => {
    login();
    cy.get(':nth-child(3) > .wallet-buttons > .q-btn-group > :nth-child(1) > .q-btn__wrapper > .q-btn__content').click();
    cy.get('.to > .q-field > .q-field__inner > .q-field__control').type('0x4hk5y38945uy3ih45639057802304242o');
    cy.get(':nth-child(1) > .q-field > .q-field__inner > .q-field__control').click();
    cy.get('.q-field__messages > div').should('be.visible');
    cy.get('.to > .q-field > .q-field__inner > .q-field__control > .q-field__control-container > input').clear().type('0x47Db1624329CDe4f37A512Fb52dadb98BD83a7d2');
    const amountInput = '.amount > :nth-child(1) > .q-field > .q-field__inner > .q-field__control > .q-field__control-container > input';
    const amountCurrencyInput = '.amount > :nth-child(2) > .q-field > .q-field__inner > .q-field__control > .q-field__control-container > input';


    cy.get(amountInput).type(101);
    cy.get(amountInput).clear();

    cy.get(amountCurrencyInput).type(1000);
    cy.get(amountCurrencyInput).clear();


    cy.get('.send > .q-btn > .q-btn__wrapper').click();

    cy.get(amountInput).type(1);

    cy.get('.send > .q-btn > .q-btn__wrapper').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('.header-back-button-wrapper > button').eq(2).click();

    cy.get('.send > .q-btn > .q-btn__wrapper').eq(0).click();

    cy.get('.modal-layout-wrapper > .send > .q-btn > .q-btn__wrapper').click();
  });

  it('receive a transaction from an evm chain', () => {
    login();
  });
});
