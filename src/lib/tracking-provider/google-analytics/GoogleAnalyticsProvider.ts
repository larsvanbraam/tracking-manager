import AbstractTrackingProvider from '../AbstractTrackingProvider';
import debug from 'debug';
import {
  IGoogleAnalyticsPageViewData,
  IGoogleAnalyticsProviderOptions,
  IGoogleAnalyticsTrackEventData,
} from './IGoogleAnalyticsData';
import TrackingManager from '../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for Google Analytics, for more information please
 * check the official documentation:
 * - https://developers.google.com/analytics/devguides/collection/analyticsjs.
 *
 * Example usage:
 * ```typescript
 * new GoogleAnalyticsProvider({
 *   trackingId: 'UA-XXXXX-Y',
 * }
 * ```
 *
 * @class GoogleAnalyticsProvider
 */
export default class GoogleAnalyticsProvider extends AbstractTrackingProvider<
  IGoogleAnalyticsProviderOptions
> {
  /**
   * Namespace in which the google analytics is loaded
   */
  private static _NAMESPACE: string = 'ga';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:googleAnalytics`);

    /* tslint:disable */
    ((i, s, o, g, r, a, m) => {
      i['GoogleAnalyticsObject'] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date().getTime());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
      this.handleApiLoaded();
    })(
      window,
      document,
      'script',
      '//www.google-analytics.com/analytics.js',
      GoogleAnalyticsProvider._NAMESPACE,
    );
    /* tslint:enable */

    // Create the google analytics API with the correct trackingId
    window[GoogleAnalyticsProvider._NAMESPACE]('create', this.providerOptions.trackingId, 'auto');
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: IGoogleAnalyticsTrackEventData): Promise<void> {
    return this.providerReady
      .then(() => {
        const ga = window[GoogleAnalyticsProvider._NAMESPACE];
        const { category, action, label, value } = data;

        if (value !== undefined) {
          if (value === Math.floor(value) && Math.abs(value) !== Infinity) {
            ga('send', 'event', category, action, label, value);
          } else {
            throw new TypeError('Google Analytics event value must be an integer');
          }
        } else if (label) {
          ga('send', 'event', category, action, label);
        } else {
          ga('send', 'event', category, action);
        }
      })
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(data: IGoogleAnalyticsPageViewData): Promise<void> {
    return this.providerReady
      .then(() => window[GoogleAnalyticsProvider._NAMESPACE]('send', 'pageview', data.page))
      .then(() => this.logger(`trackPageView: ${JSON.stringify(data)}`));
  }
}
