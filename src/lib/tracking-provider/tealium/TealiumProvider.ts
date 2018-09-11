import debug from 'debug';
import { ITealiumProviderOptions, ITealiumPageViewData, ITealiumTrackEventData } from './ITealiumData';
import AbstractApiTrackingProvider from '../AbstractApiTrackingProvider';
import TrackingManager from '../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for utag Tealium tracking, for more information please
 * check the official documentation:
 * - https://community.tealiumiq.com/t5/JavaScript-utag-js/Adding-utag-js-to-your-site/ta-p/14785
 *
 * Example usage:
 * ```typescript
 * new TealiumProvider({
 *   trackingId: '',
 * }
 * ```
 *
 * @class TealiumProvider
 */
export default class TealiumProvider extends AbstractApiTrackingProvider<ITealiumProviderOptions> {
  /**
   * The tracking provider is loaded into the following hardcoded namespace.
   */
  private static NAMESPACE: string = 'utag';

  /**
   * The tracking provider data is loaded into the following hardcoded namespace.
   */
  private static DATA: string = 'utag_data';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:tealium`);

    // Initially set the landing route
    window[TealiumProvider.DATA] = window[TealiumProvider.DATA] || {};
    window[TealiumProvider.DATA].page_category = this.providerOptions.pageCategory;
    window[TealiumProvider.DATA].page_name = this.providerOptions.pageName;

    this.loadApi(this.providerOptions.url);
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: ITealiumTrackEventData): Promise<void> {
    return this.providerReady
      .then(() => window[TealiumProvider.NAMESPACE].link(Object.assign({}, data)))
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(data: ITealiumPageViewData): Promise<void> {
    return this.providerReady
      .then(() =>
        window[TealiumProvider.NAMESPACE].view(Object.assign(window[TealiumProvider.DATA], data)),
      )
      .then(() => this.logger(`trackPageView: ${JSON.stringify(data)}`));
  }
}
