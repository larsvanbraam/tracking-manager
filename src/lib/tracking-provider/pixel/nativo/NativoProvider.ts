import debug from 'debug';
import { LoadImageTask } from 'task-loader';
import AbstractTrackingProvider from '../../AbstractTrackingProvider';
import { INativoProviderOptions, INativoTrackEventData } from './INativoData';
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
  public trackEvent(data: INativoTrackEventData): Promise<void> {
    return this.providerReady
      .then(() => {
        const loadTask = new LoadImageTask({
          assets: `//jadserve.postrelease.com/conversion?ntv_pixel_id=${
            this.providerOptions.trackingPixelId
          }${data.value !== undefined ? `&ntv_pixel_value=${data.value}` : ''}`,
          cached: false,
        });

        return loadTask.load().then(() => {
          loadTask.dispose();
        });
      })
      .then(() => this.logger(`trackEvent`))
      .catch(() => this.logger(`Failed to load the tracking pixel`));
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
