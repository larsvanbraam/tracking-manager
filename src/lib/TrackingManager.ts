import Disposable from 'seng-disposable';
import assign from 'lodash/assign';
import ITrackingManagerOptions from './ITrackingManagerOptions';
import AbstractTrackingProvider from './tracking-provider/AbstractTrackingProvider';

/**
 * This class is used to wrap all the tracking providers so you can easily add multiple analytics
 * providers to your site. Use the addProvider method add them while constructing this class.
 *
 * All tracking providers log the events with debug (https://www.npmjs.com/package/debug), to view the logs you have
 * to update your local storage by running this in the console:
 *
 * ```console
 * localStorage.debug = 'trackingManager:*'
 * ```
 *
 * To disable the logs run the following in your console
 *
 * ```console
 * delete localStorage.debug
 * ```
 *
 * Example usage:
 * ```typescript
 * const trackingManager = new TrackingManager({
 *      providers: {
 *          ga: new GoogleAnalyticsTrackingProvider({
 *              trackingId: 'UA-XXXXXXX',
 *          }),
 *          fbq: new FacebookTrackingPixelProvider({
 *              trackingPixelId: 'XXXXXXXXXX',
 *          }),
 *      }
 * });
 *
 * trackingManager.trackEvent({
 *      ga: {
 *          label: 'Purchase',
 *          category: 'shop'
 *      },
 *      fbq: {
 *          event: 'Purchase',
 *      },
 * });
 * ```
 *
 * @class TrackingManager
 */
export default class TrackingManager extends Disposable {
  public static LOG_NAMESPACE: string = 'trackingManager';

  private options: ITrackingManagerOptions;
  private providers: {
    [id: string]: AbstractTrackingProvider<any>;
  } = {};

  constructor(options: ITrackingManagerOptions) {
    super();

    // Store the provided options
    this.options = assign({}, options);

    // Add the providers that were provided when creating the tracking manager
    Object.keys(this.options.providers || {}).forEach((id: string) =>
      this.addProvider(id, this.options.providers[id]),
    );
  }

  /**
   * @public
   * @method addProvider
   * @param {string} id
   * @param {AbstractTrackingProvider<IAbstractTrackingProviderOptions>} provider
   * @description Add an extra provider to the providers object
   */
  public addProvider(id: string, provider: AbstractTrackingProvider<any>): void {
    this.providers[id] = provider;
  }

  /**
   * Remove a provider from the providers object
   *
   * @returns {void}
   */
  public removeProvider(id: string): void {
    delete this.providers[id];
  }

  /**
   *
   * Get a provider from the providers object
   *
   * @returns {AbstractTrackingProvider<any>}
   */
  public getTrackingProvider(id: string): AbstractTrackingProvider<any> {
    return this.providers[id];
  }

  /**
   * Loop through all the providers and trigger an event
   *
   * @param {{[provider: string]: any}} data
   * @returns {void}
   */
  public trackEvent(data: { [provider: string]: any }): void {
    Object.keys(data).forEach(id => this.providers[id].trackEvent(data[id]));
  }

  /**
   * Loop through all the providers and trigger a page view
   *
   * @param {{[provider: string]: any}} data
   */
  public trackPageView(data: { [provider: string]: any }): void {
    Object.keys(data).forEach((id: string) => this.providers[id].trackPageView(data[id]));
  }

  /**
   * Dispose the tracking manager
   *
   * @returns {void}
   */
  public dispose(): void {
    // Dispose all the added providers as well
    Object.keys(this.providers).forEach(key => this.providers[key].dispose());

    this.providers = null;
    this.options = null;

    super.dispose();
  }
}
