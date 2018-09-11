import AbstractTrackingProvider from '../src/lib/tracking-provider/AbstractTrackingProvider';
import TrackingManager from '../src/lib/TrackingManager';
import debug from 'debug';

export default class MockProvider extends AbstractTrackingProvider<any> {
  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:mockProvider`);

    this.handleApiLoaded();
  }

  /**
   * The method that actually triggers the tracking of the event.
   *
   * @returns { Promise<void> }
   */
  public trackEvent(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`MockProvider does not support event tracking`));
  }

  /**
   * The method that actually triggers the tracking of the page view.
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`MockProvider does not support page tracking`));
  }
}
