import { LoadScriptTask } from 'task-loader';
import debug from 'debug';
import AbstractTrackingProvider from '../AbstractTrackingProvider';
import { IGoogleGlobalSiteTagManagerProviderOptions, IGoogleGlobalSiteTagManagerTrackEventData } from './IGoogleGlobalSiteTagManagerData';

/**
 * This class provides a tracking provider that can be used for Google Global Site Tag Manager, for more information
 * please check the official documentation:
 * - https://developers.google.com/analytics/devguides/collection/gtagjs.
 *
 * Example usage:
 * ```typescript
 * new GoogleGlobalSiteTagManagerProvider({
 *   namespace: 'foo',
 *   trackingId: 'UA-XXXXX-Y',
 * }
 * ```
 *
 * @class GoogleGlobalSiteTagManagerProvider
 */
export default class GoogleGlobalSiteTagManagerProvider extends AbstractTrackingProvider<
  IGoogleGlobalSiteTagManagerProviderOptions
> {
  /**
   * Namespace in which the google tag manager is loaded
   */
  private static NAMESPACE: string = 'gtag';

  /**
   * Method used for storing the loading of the sdk.
   */
  private googleGlobalSiteTagPromise: Promise<void>;

  /**
   * The google site tag can be re-used for multiple instances so we only load it once!
   *
   * @returns {Promise<void>}
   */
  private loadGoogleGlobalSiteTag(trackingId: string): Promise<void> {
    if (!this.googleGlobalSiteTagPromise) {
      this.googleGlobalSiteTagPromise = new Promise(resolve => {
        const loadTask = new LoadScriptTask({
          assets: `//www.googletagmanager.com/gtag/js?id=${trackingId}`,
          cached: false,
        });

        loadTask.load().then(() => {
          window['dataLayer'] = window['dataLayer'] || [];
          window[GoogleGlobalSiteTagManagerProvider.NAMESPACE] = function() {
            window['dataLayer'].push(arguments);
          };
          window[GoogleGlobalSiteTagManagerProvider.NAMESPACE]('js', new Date());

          // Clean the task
          loadTask.dispose();

          resolve();
        });
      });
    }

    return this.googleGlobalSiteTagPromise;
  }

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`trackingManager:gtag.${this.providerOptions.namespace}`);

    this.loadGoogleGlobalSiteTag(this.providerOptions.trackingId).then(() => {
      window[GoogleGlobalSiteTagManagerProvider.NAMESPACE](
        'config',
        this.providerOptions.trackingId,
      );
      this.handleApiLoaded();
    });
  }

  /**
   * The method that actually triggers the tracking of the event.
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: IGoogleGlobalSiteTagManagerTrackEventData): Promise<void> {
    return this.providerReady
      .then(() =>
        window[GoogleGlobalSiteTagManagerProvider.NAMESPACE]('event', data.event, data.data),
      )
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * The method that actually triggers the tracking of the page view.
   *
   * @returns { Promise<void> }
   */
  public trackPageView(data: any): Promise<void> {
    return this.providerReady
      .then(() => window[GoogleGlobalSiteTagManagerProvider.NAMESPACE](data))
      .then(() => this.logger(`trackPageView: ${JSON.stringify(data)}`));
  }
}
