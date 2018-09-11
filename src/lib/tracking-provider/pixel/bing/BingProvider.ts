import debug from 'debug';
import AbstractTrackingProvider from '../../AbstractTrackingProvider';
import { IBingProviderOptions, IBingTrackEventData } from './IBingData';
import TrackingManager from '../../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for the Bing tracking pixel, the official Bing
 * documentation does not contain a lot of information:
 * - https://advertise.bingads.microsoft.com/en-us/resources/training/what-is-bing-ads
 *
 * A little bit more information can be found here:
 * - https://support.bigcommerce.com/articles/Public/Adding-Bing-Ads-Conversion-Tracking
 *
 * Inspect the tag in chrome with the extension:
 * - https://chrome.google.com/webstore/detail/uet-tag-helper-by-bing-ad/naijndjklgmffmpembnkfbcjbognokbf
 *
 * Example usage:
 * ```typescript
 * new BingProvider({
 *   trackingPixelId: '00000',
 * }
 * ```
 *
 * @class BingProvider
 */
export default class BingProvider extends AbstractTrackingProvider<IBingProviderOptions> {
  /**
   * The tracking provider is loaded into the following hardcoded namespace.
   */
  private static _NAMESPACE: string = 'uet';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:bingTrackingPixel`);

    /* tslint:disable */
    ((w, d, t, r, u) => {
      let f, n, i;
      (w[u] = w[u] || []),
        (f = () => {
          const o: any = { ti: this.providerOptions.trackingPixelId };
          (o.q = w[u]), (w[u] = new window['UET'](o)), w[u].push('pageLoad');
        }),
        (n = d.createElement(t)),
        (n.src = r),
        (n.async = 1),
        (n.onload = n.onreadystatechange = () => {
          const s = n.readyState;
          (s && s !== 'loaded' && s !== 'complete') ||
            (f(), (n.onload = n.onreadystatechange = null));
          this.handleApiLoaded();
        }),
        (i = d.getElementsByTagName(t)[0]),
        i.parentNode.insertBefore(n, i);
    })(window, document, 'script', '//bat.bing.com/bat.js', BingProvider._NAMESPACE);
    /* tslint:enable */
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: IBingTrackEventData): Promise<void> {
    return this.providerReady
      .then(() => window[BingProvider._NAMESPACE].push(data))
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`BingTrackingPixel does not support page views`));
  }
}
