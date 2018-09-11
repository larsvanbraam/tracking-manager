import debug from 'debug';
import AbstractApiTrackingProvider from '../../AbstractApiTrackingProvider';
import { ILinkedInProviderOptions } from './ILinkedInData';
import TrackingManager from '../../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for the Facebook tracking pixel, for more information check
 * the minimal online documentation:
 * - https://www.linkedin.com/help/lms/answer/65513
 *
 * Example usage:
 * ```typescript
 * new LinkedInProvider({
 *   trackingPixelId: '00000',
 * }
 * ```
 *
 * @class LinkedInProvider
 */
export default class LinkedInProvider extends AbstractApiTrackingProvider<ILinkedInProviderOptions> {
  /**
   * The tracking provider is loaded into the following hardcoded namespace.
   */
  private static _NAMESPACE: string = '_linkedin_data_partner_id';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:linkedInTrackingPixel`);

    window[LinkedInProvider._NAMESPACE] = this.providerOptions.trackingPixelId;

    this.loadApi('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  }

  /**
   * The method that actually triggers the tracking of the event.
   *
   * @returns { Promise<void> }
   */
  public trackEvent(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`LinkedInTrackingPixel does not support event tracking`));
  }

  /**
   * The method that actually triggers the tracking of the page view.
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`LinkedInTrackingPixel does not support page tracking`));
  }
}
