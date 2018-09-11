import debug from 'debug';
import AbstractTrackingProvider from '../AbstractTrackingProvider';
import { IHotjarProviderOptions } from './IHotjarData';
import TrackingManager from '../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for Google Global Site Tag Manager, for more information
 * please check the official documentation:
 * - https://help.hotjar.com/hc/en-us.
 *
 * Example usage:
 * ```typescript
 * new HotjarProvider({
 *   trackingId: '00000',
 * }
 * ```
 *
 * @class HotjarProvider
 */
export default class HotjarProvider extends AbstractTrackingProvider<IHotjarProviderOptions> {
  /**
   * The tracking provider is loaded into the following hardcoded namespace.
   */
  private static _NAMESPACE: string = 'hj';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:hotjar`);

    /* tslint:disable */
    ((h, o, t, j, a, r) => {
      h[HotjarProvider._NAMESPACE] =
        h[HotjarProvider._NAMESPACE] ||
        function() {
          (h[HotjarProvider._NAMESPACE].q = h[HotjarProvider._NAMESPACE]['q'] || []).push(
            arguments,
          );
        };
      h['_hjSettings'] = {
        hjid: this.providerOptions.trackingId,
        hjsv: 5,
      };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h['_hjSettings']['hjid'] + j + h['_hjSettings']['hjsv'];
      r.onload = () => this.handleApiLoaded();
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
    /* tslint:enable */
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`Hotjar does not support event tracking`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`Hotjar does not support page tracking`));
  }
}
