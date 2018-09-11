import debug from 'debug';
import { LoadImageTask } from 'task-loader';
import AbstractTrackingProvider from '../../AbstractTrackingProvider';
import { INativoProviderOptions } from './INativoData';
import TrackingManager from '../../../TrackingManager';

/**
 * This class provides a tracking provider that can be used for the Facebook tracking pixel, there was
 * not much documentation but the site can be found here:
 * - https://www.nativo.com.
 *
 * Example usage:
 * ```typescript
 * new NativoProvider({
 *   trackingPixelId: '00000',
 * }
 * ```
 *
 * @class NativoProvider
 */
export default class NativoProvider extends AbstractTrackingProvider<INativoProviderOptions> {
  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:nativoTrackingPixel`);

    // No extra api loading required, so mark as done right away.
    this.handleApiLoaded();
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(): Promise<void> {
    return this.providerReady
      .then(() => {
        const loadTask = new LoadImageTask({
          assets: `//jadserve.postrelease.com/conversion?ntv_pixel_id=${
            this.providerOptions.trackingPixelId
          }&ntv_pixel_value=[optional_float]`,
          cached: false,
        });

        return loadTask.load().then(() => {
          loadTask.dispose();
        });
      })
      .then(() => this.logger(`trackEvent`))
      .catch(() => this.logger(`trackEvent failed`));
  }

  /**
   * The method that actually triggers the tracking of the page view.
   *
   * @returns { Promise<void> }
   */
  public trackPageView(): Promise<void> {
    return this.providerReady
      .then(() => Promise.resolve())
      .then(() => this.logger(`NativoTrackingPixel does not support page tracking`));
  }
}
