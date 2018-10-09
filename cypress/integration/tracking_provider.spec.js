/* eslint-disable */
import TrackingProvider from '../../example/src/TrackingProvider';


describe('TrackingProviders', () => {
  // We store the spies in an object so we can use them later on
  const spies = {};

  beforeEach(() => {
    cy.visit('http://localhost:8080', {
      onLoad(window) {
        Object.values(TrackingProvider).forEach(provider => {
          spies[provider] = {
            trackEvent: cy.spy(window.cypress[provider], 'trackEvent'),
            trackPageView: cy.spy(window.cypress[provider], 'trackPageView'),
          };
        });
      },
    });
  });

  Object.values(TrackingProvider).forEach(provider => {
    describe(provider, () => {
      // Dynamically create all the tests because they are the same for all providers
      it('Should trigger the track event action', () => {
        const button = cy.get(`[data-provider="${provider}"] [data-cy="event-button"]`);

        // The button should not be disabled
        button.should('not.be.disabled');

        // Trigger the click
        button.click().then(() => {
          expect(spies[provider].trackEvent).to.be.called;
        });
      });

      it('Should trigger the track page action', () => {
        const button = cy.get(`[data-provider="${provider}"] [data-cy="page-button"]`);

        // The button should not be disabled
        button.should('not.be.disabled');

        // Trigger the click
        button.click().then(() => {
          expect(spies[provider].trackPageView).to.be.called;
        });
      });
    });
  });
});
