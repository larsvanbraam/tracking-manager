/* eslint-disable */
import chaiAsPromised from 'chai-as-promised';
import TrackingProvider from '../../example/src/TrackingProvider';

chai.use(chaiAsPromised);

describe('TrackingProviders', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  Object.values(TrackingProvider).forEach(provider => {
    describe(provider, () => {
      switch (provider) {
        case TrackingProvider.TEALIUM_PROVIDER:
          // The Tealium provider will always fail because of incorrect credentials
          it('Should should fail loading the API, because of incorrect credentials', () => {
            const button = cy.get(`[data-provider="${provider}"] [data-cy="event-button"]`);

            // The button should be disabled
            button.should('be.disabled');
          });
          break;
        default:
          // Dynamically create all the tests because they are the same for all providers
          it('Should trigger the track event action', () => {
            const button = cy.get(`[data-provider="${provider}"] [data-cy="event-button"]`);

            // The button should not be disabled
            button.should('not.be.disabled');

            // Trigger the click
            expect(button.click()).to.be.fulfilled;
          });

          it('Should trigger the track page action', () => {
            const button = cy.get(`[data-provider="${provider}"] [data-cy="page-button"]`);

            // The button should not be disabled
            button.should('not.be.disabled');

            // Trigger the click
            expect(button.click()).to.be.fulfilled;
          });
          break;
      }
    });
  });
});
