import AbstractTrackingProvider from './AbstractTrackingProvider';
import LoadScriptTask from 'task-loader/lib/task/LoadScriptTask';

/**
 * This class is one level above the base class for all the tracking providers, a lot of tracking providers require
 * you to load a script tag that initializes some sort of API. Extending this class provides you with the base
 * configuration required for making that happen.
 *
 * @typeparam T This should be the interface for the tracking provider options. This usually contains the base configuration.
 * @class AbstractApiTrackingProvider
 */
export default abstract class AbstractApiTrackingProvider<T> extends AbstractTrackingProvider<T> {
  /**
   * The task that loads the API
   */
  private loadScripTask: LoadScriptTask;

  /**
   * Method to actually load the API
   *
   * @param url This is the url that needs to be loaded before the API is initialized.
   * @returns {Promise<void>}
   */
  protected loadApi(url: string): void {
    this.loadScripTask = new LoadScriptTask({
      assets: url,
      cached: false,
    });

    this.loadScripTask
      .load()
      .then(() => this.handleApiLoaded())
      .catch(() => this.handleApiFailed());
  }

  /**
   * Method that is triggered when the api is successfully loaded
   *
   * @returns {void}
   */
  protected handleApiLoaded(): void {
    setTimeout(() => this.loadScripTask.dispose(), 0);

    super.handleApiLoaded();
  }

  /**
   * Method that is triggered when the api has failed loading
   *
   * @returns {void}
   */
  protected handleApiFailed(): void {
    setTimeout(() => this.loadScripTask.dispose(), 0);

    super.handleApiFailed();
  }
}
