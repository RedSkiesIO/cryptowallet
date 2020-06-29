/* eslint-disable no-magic-numbers */

describe('Account Setup', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('sets up an account using a seed phrase', () => {
    cy.get('.get-started-btn').click();

    cy.get('.recoveryPhrase [type="radio"]').not('[disabled]')
      .check({ force: true });

    cy.get('.q-btn').eq(1).click();
    const seedArray = [];
    let newArray = [];
    let reversed = [];
    cy.get('.word-span').each(($seed) => {
      seedArray.push($seed.text().replace(/[^a-z]/ig, ''));
    })
      .then(() => {
      // try new seed
        cy.get('.q-btn').eq(1).click();
        cy.get('.word-span').each(($seed) => {
          newArray.push($seed.text().replace(/[^a-z]/ig, ''));
        })
          .then(() => {
            expect(newArray).to.not.equal(seedArray);
          });
      })
      .then(() => {
        cy.get('.q-btn').eq(2).click();
        cy.get('.q-card__actions > .q-btn').eq(1).click();
        reversed = newArray.reverse();
      })
      .then(() => {
        cy.wrap(reversed).each((word) => {
          cy.get('.randomSeedContainer').contains(word).click();
        });
      })
      .then(() => {
        newArray = newArray.reverse();
      })
      .then(() => {
        cy.wrap(newArray).each((word) => {
          cy.get('.randomSeedContainer .q-btn').contains(word).should('not.be.disabled').click();
        });
      });

    let pin = new Array(5);
    cy.wrap(pin).each(() => {
      cy.contains(0).click();
    });
    cy.get('.btns-wrapper > .q-btn').eq(1).should('be.disabled');
    cy.get('.btns-wrapper > .q-btn').eq(0).click()
      .then(() => {
        cy.get('.dots-wrapper').should('be.empty');
      })
      .then(() => {
        pin = new Array(6);
        cy.wrap(pin).each((value, index) => {
          cy.contains(index).click();
        });
        cy.get('.btns-wrapper > .q-btn').eq(1).should('not.be.disabled').click();
      });

    cy.wrap(new Array(6)).each(() => {
      cy.contains(1).click();
    });
    cy.get('.btns-wrapper > .q-btn').eq(1).click();
    cy.get('.dots-wrapper').should('be.empty');

    cy.wrap(new Array(6)).each((value, index) => {
      cy.contains(index).click();
    });
    cy.get('.btns-wrapper > .q-btn').eq(1).should('not.be.disabled').click();

    cy.get('.q-field__native').type('*(&^*');
    cy.get('.btns-wrapper > .q-btn').eq(0).click();

    cy.get('.q-field__native').clear();
    cy.get('.q-field__native').type('Test');
    cy.get('.btns-wrapper > .q-btn').eq(0).click();
  });

  it('imports an account using a seed phrase', () => {
    const recoveryPhrase = 'infant enlist human promote economy merit kind worth version great cherry fiber';
    const badPhrase = 'frost come decrease record invest unusual guide office peanut rose stamp position stand';
    cy.get('.import-account-btn').should('to.exist').click();

    cy.get('.q-field__native').type(badPhrase);
    cy.get('.btns-wrapper > .q-btn > .q-btn__wrapper').click();
    cy.get('.q-notification__message').should('to.exist');

    cy.get('.q-field__native').clear();

    cy.get('.q-field__native').type(recoveryPhrase);
    cy.get('.btns-wrapper > .q-btn > .q-btn__wrapper').click();
    cy.url().should('include', '/setup/4');

    cy.wrap(new Array(6)).each((value, index) => {
      cy.contains(index).click();
    });
    cy.get('.bg-yellow > .q-btn__wrapper').should('to.exist').click();

    cy.wrap(new Array(6)).each((value, index) => {
      cy.contains(index).click();
    });
    cy.get('.bg-yellow > .q-btn__wrapper').should('to.exist').click();

    cy.get('.q-field__control').type('Test');
    cy.get('.btns-wrapper > .q-btn > .q-btn__wrapper').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(30000, { requestTimeout: 60000 });
    cy.url().should('include', '/wallet');
  });
});
