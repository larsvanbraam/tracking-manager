import debug from 'debug';
import AbstractApiTrackingProvider from '../AbstractApiTrackingProvider';
import TrackingManager from '../../TrackingManager';
import { IForensicsProviderOptions } from './IForensicsProviderData';

/**
 * This class provides a tracking provider that can be used for Lead Forensics, the website does not contain a
 * lot of information but you can find the site here:
 * - https://www.leadforensics.com.
 *
 * Example usage:
 * ```typescript
 * new ForensicsProvider({
 *   trackingId: '00000',
 * }
 * ```
 *
 * @class ForensicsProvider
 */
export default class ForensicsProvider extends AbstractApiTrackingProvider<IForensicsProviderOptions> {
  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:forensics`);

    this.loadApi(`https://secure.leadforensics.com/js/${this.providerOptions.trackingId}.js`);
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`ForensicsProvider does not support event tracking`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`ForensicsProvider does not support page views`));
  }
}
