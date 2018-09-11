import AbstractTrackingProvider from '../../AbstractTrackingProvider';
import debug from 'debug';
import { IFacebookProviderOptions, IFacebookTrackEventData } from './IFacebookData';
import TrackingManager from '../../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for the Facebook tracking pixel, for more information check
 * the online documentation:
 * - https://developers.facebook.com/docs/ads-for-websites/pixel-events/v3.1
 *
 * Example usage:
 * ```typescript
 * new FacebookProvider({
 *   trackingPixelId: '00000',
 * }
 * ```
 *
 * @class FacebookProvider
 */
export default class FacebookProvider extends AbstractTrackingProvider<IFacebookProviderOptions> {
  /**
   * Namespace in which the google tag manager is loaded
   */
  private static _NAMESPACE: string = 'fbq';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:facebookTrackingPixel`);

    /* tslint:disable */
    let n;

    n = window[FacebookProvider._NAMESPACE] = (...args) => {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    };

    if (!window[FacebookProvider._NAMESPACE]) {
      window[FacebookProvider._NAMESPACE] = n;
    }

    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    const t = document.createElement('script');
    t.async = !0;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
    /* tslint:enable */

    window[FacebookProvider._NAMESPACE]('init', this.providerOptions.trackingPixelId);

    this.handleApiLoaded();
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: IFacebookTrackEventData): Promise<void> {
    return this.providerReady
      .then(() => window[FacebookProvider._NAMESPACE]('track', data.event, data.parameters))
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => window[FacebookProvider._NAMESPACE]('track', 'PageView'))
      .then(() => this.logger(`trackPageView`));
  }
}
