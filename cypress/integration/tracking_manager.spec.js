/* eslint-disable */
import TrackingProvider from '../../example/src/TrackingProvider';

describe('TrackingManager', () => {
  // We store the spies in an object so we can use them later on
  const spies = {};

  beforeEach(() => {
    cy.visit('http://localhost:8080', {
      onLoad(win) {
        spies.addProvider = cy.spy(win.cypress.trackingManager, 'addProvider')
      },
    });
  });

  describe('AddProvider', () => {
    it('Should check if the add provider method is called the correct amount of times', () => {
      expect(spies.addProvider).to.be.callCount(Object.keys(TrackingProvider).length)
    });
  })
});
