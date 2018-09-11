import { expect } from 'chai';
import TrackingManager from '../src/lib/TrackingManager';
import MockProvider from "./MockProvider";

const providerId:string = 'mock';
let trackingManager: TrackingManager;

describe('Example', () => {
  beforeEach(() => {
    trackingManager = new TrackingManager({
      providers: {},
    });
  });

  it('should add a tracking provider to the tracking manager and check if it is added', () => {
    const mockProvider = new MockProvider({
      url: 'https://tags.tiqcdn.com/utag/foo/bar/dev/utag.js',
      pageCategory: 'foo',
      pageName: 'bar',
    });

    trackingManager.addProvider(providerId, mockProvider);

    expect(trackingManager.getTrackingProvider(providerId)).to.equal(mockProvider);
  });

  it('should add a tracking provider and then try to remove it', () => {
    const mockProvider = new MockProvider({
      url: 'https://tags.tiqcdn.com/utag/foo/bar/dev/utag.js',
      pageCategory: 'foo',
      pageName: 'bar',
    });

    trackingManager.addProvider(providerId, mockProvider);
    trackingManager.removeProvider(providerId);

    expect(trackingManager.getTrackingProvider(providerId)).to.equal(undefined);
  });

  // it('should add a tracking provider to the tracking manager and trigger a page view', () => {
  //   const mockProvider = new MockProvider({
  //     url: 'https://tags.tiqcdn.com/utag/foo/bar/dev/utag.js',
  //     pageCategory: 'foo',
  //     pageName: 'bar',
  //   });
  //
  //   trackingManager.addProvider(providerId, mockProvider);
  //
  //   trackingManager.trackPageView({
  //     mock: {},
  //   })
  //
  //   expect(trackingManager.getTrackingProvider(providerId)).to.equal(mockProvider);
  // });
});
