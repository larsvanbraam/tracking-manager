import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import TrackingManager from '../src/lib/TrackingManager';
import MockProvider from './tracking-provider/util/MockProvider';

chai.use(chaiAsPromised);

const providerId: string = 'mock';
let mockProvider: MockProvider;

describe('TrackingManager', () => {
  beforeEach(() => {
    mockProvider = new MockProvider({
      trackingId: 'xxxxxx',
    });
  });

  it('should create a new instance for the tracking manager', () => {
    const trackingManager = new TrackingManager();

    expect(trackingManager.getTrackingProviders()).to.be.an('object').that.is.empty;
  });

  it('should add a tracking provider to the tracking manager and check if it is added', () => {
    const trackingManager = new TrackingManager({
      providers: {
        [providerId]: mockProvider,
      },
    });

    expect(trackingManager.getTrackingProvider(providerId)).to.equal(mockProvider);
  });

  it('should add a tracking provider and then try to remove it', () => {
    const trackingManager = new TrackingManager({
      providers: {
        [providerId]: mockProvider,
      },
    });

    trackingManager.removeProvider(providerId);

    expect(trackingManager.getTrackingProvider(providerId)).to.equal(undefined);
  });

  it('should trigger a track event', () => {
    const trackingManager = new TrackingManager({
      providers: {
        [providerId]: mockProvider,
      },
    });

    expect(trackingManager.trackEvent({
      mock: {},
    })).to.be.fulfilled;
  });

  it('should trigger a page view event', () => {
    const trackingManager = new TrackingManager({
      providers: {
        [providerId]: mockProvider,
      },
    });

    expect(trackingManager.trackEvent({
      mock: {},
    })).to.be.fulfilled;
  });

  it('should dispose the tracking manager', () => {
    const trackingManager = new TrackingManager({
      providers: {
        [providerId]: mockProvider,
      },
    });

    trackingManager.dispose();

    expect(trackingManager.isDisposed()).to.equal(true);
  });

  it('should fail when we try to add a provider with incorrect options', () => {
    expect(() => {
      new TrackingManager({
        providers: {
          [providerId]:  new MockProvider(null),
        },
      });
    }).to.to.throw('The options should be provided in an object')
  });
});
