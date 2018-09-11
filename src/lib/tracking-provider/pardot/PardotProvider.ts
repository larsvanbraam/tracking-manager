import debug from 'debug';
import AbstractApiTrackingProvider from '../AbstractApiTrackingProvider';
import { IPardotProviderOptions } from './IPardotData';
import TrackingManager from '../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for basic Pardot tracking. It does not support any page
 * tracking or event tracking but solely relies on the loading of the pd.js file with the
 * correct applicationId, clientId and hostname. See the forum or implementation guide for more information:
 * - https://help.salesforce.com/articleView?id=pardot_implement_tracking_code.htm
 * - https://help.salesforce.com/articleView?id=000270502&type=1&language=en_US
 *
 * Example usage:
 * ```typescript
 * new PardotProvider({
 *   clientId: '00000',
 *   applicationId: '00000',
 *   hostname: 'foo.bar',
 * }
 * ```
 *
 * @class PardotProvider
 */
export default class PardotProvider extends AbstractApiTrackingProvider<IPardotProviderOptions> {
  /**
   * @protected
   * @description The init method that initializes the google analytics library
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:pardot`);

    // Set window vars for Pardot
    window['piAId'] = this.providerOptions.applicationId;
    window['piCId'] = this.providerOptions.clientId;
    window['piHostname'] = this.providerOptions.hostname;

    this.loadApi(`https://pi.pardot.com/pd.js`);
  }

  /**
   * @public
   * @method trackEvent
   * @description The method that actually triggers the tracking of the event
   * @returns { Promise<void> }
   */
  public trackEvent(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`Pardot does not support event tracking`));
  }

  /**
   * @public
   * @method trackPageView
   * @description The method that actually triggers the tracking of the page view
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`Pardot does not support page tracking`));
  }
}
