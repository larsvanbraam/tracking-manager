import debug from 'debug';
import { LoadScriptTask } from 'task-loader';
import AbstractTrackingProvider from '../AbstractTrackingProvider';
import { IMediaMathProviderOptions } from './IMediaMathData';
import TrackingManager from '../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for Google Global Site Tag Manager, the website does not
 * contain a lot of information but you can find the site here:
 * - http://www.mediamath.com/
 *
 * Example usage:
 * ```typescript
 * new MediaMathProvider({
 *   trackingId: '00000',
 * }
 * ```
 *
 * @class MediaMathProvider
 */
export default class MediaMathProvider extends AbstractTrackingProvider<IMediaMathProviderOptions> {
  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:mediaMath`);

    // No extra api loading required, so mark as done right away.
    this.handleApiLoaded();
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: any): Promise<void> {
    const loadScriptTask = new LoadScriptTask({
      assets: `//pixel.mathtag.com/event/js?mt_id=${
        data.trackingId
      }&mt_adid=178051&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3=`,
      cached: false,
    });

    return loadScriptTask
      .load()
      .then(() => {
        this.logger(`trackEvent: ${JSON.stringify(data)}`);
        setTimeout(() => loadScriptTask.dispose(), 0);
      })
      .catch(() => {
        setTimeout(() => loadScriptTask.dispose(), 0);
      });
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`MediaMath does not support page tracking`));
  }
}
