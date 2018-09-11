import AbstractTrackingProvider from '../../AbstractTrackingProvider';
import debug from 'debug';
import { ITwitterProviderOptions, ITwitterTrackEventData } from './ITwitterData';

/**
 * This class provides a tracking provider that can be used for the Facebook tracking pixel, for more information check
 * the online documentation:
 * - https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html
 *
 * Example usage:
 * ```typescript
 * new TwitterProvider({
 *   trackingPixelId: '00000',
 * }
 * ```
 *
 * @class TwitterProvider
 */
export default class TwitterProvider extends AbstractTrackingProvider<ITwitterProviderOptions> {
  /**
   * @description Namespace in which the twitter pixel is loaded
   * @type {string}
   * @private
   */
  private static NAMESPACE: string = 'twq';

  /**
   * @protected
   * @description The init method that initializes the google analytics library
   */
  protected init(): void {
    this.logger = debug('trackingManager:twitterTrackingPixel');

    /* tslint:disable */
    !(function(e, t, n, s, u, a) {
      e[TwitterProvider.NAMESPACE] ||
        ((s = e[TwitterProvider.NAMESPACE] = (...args) => {
          s.exe ? s.exe.apply(s, args) : s.queue.push(args);
        }),
        (s.version = '1.1'),
        (s.queue = []),
        (u = t.createElement(n)),
        (u.async = !0),
        (u.src = '//static.ads-twitter.com/uwt.js'),
        (a = t.getElementsByTagName(n)[0]),
        a.parentNode.insertBefore(u, a));
    })(window, document, 'script');
    /* tslint:enable */

    window[TwitterProvider.NAMESPACE]('init', this.providerOptions.trackingPixelId);
    this.handleApiLoaded();
  }

  /**
   * @public
   * @method trackEvent
   * @description The method that actually triggers the tracking of the event
   * @returns { Promise<void> }
   */
  public trackEvent(data: ITwitterTrackEventData): Promise<void> {
    if (!data.event || !data.parameters)
      throw new Error('event and parameters are required for event tracking');

    return this.providerReady
      .then(() => window[TwitterProvider.NAMESPACE]('track', data.event, data.parameters))
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * @public
   * @method trackPageView
   * @description The method that actually triggers the tracking of the page view
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => window[TwitterProvider.NAMESPACE]('track', 'PageView'))
      .then(() => this.logger(`trackPageView`));
  }
}
