import Disposable from 'seng-disposable';
import isObject from 'lodash/isObject';
import debug from 'debug';

/**
 * This class is the base class for all tracking providers, it contains the most default setup for configuring a
 * tracking provider. The class should always be extended by another provider class that adds the
 * required provider configuration.
 *
 * @typeparam T This should be the interface for the tracking provider options. This usually contains the base configuration.
 * @class AbstractTrackingProvider
 */
abstract class AbstractTrackingProvider<T> extends Disposable {
  /**
   * This is the configuration object that contains all the base information required for initializing the provider.
   */
  protected providerOptions: T;

  /**
   * This promise will be resolved or rejected once the provider is ready for usage.
   */
  public providerReady: Promise<void>;

  /**
   * This is the resolve method that should be triggered once the provider is ready for usage.
   */
  protected providerReadyResolveMethod: () => void;

  /**
   * This is the reject method that should be triggered if the provider loadings fails for what ever reason.
   */
  protected providerReadyRejectMethod: () => void;

  /**
   * This is the logger instance that can be used to trigger namespaced logs.
   */
  protected logger: debug;

  constructor(options: T) {
    super();

    if (!isObject(options)) throw new Error('The options should be provided in an object');

    this.providerOptions = options;

    // This is promise is there to make sure the provider is ready when triggering the tracking methods
    this.providerReady = new Promise<void>((resolve, reject) => {
      this.providerReadyResolveMethod = resolve;
      this.providerReadyRejectMethod = reject;
    });

    // Initialize the provider
    this.init();
  }

  /**
   * Method that is triggered when the api is successfully loaded
   *
   * @returns {void}
   */
  protected handleApiLoaded(): void {
    this.providerReadyResolveMethod();
    this.logger(`Loaded`);
  }

  /**
   * Method that is triggered when the api has failed loading
   *
   * @returns {void}
   */
  protected handleApiFailed(): void {
    this.providerReadyRejectMethod();
    this.logger(`Failed`);
  }

  /**
   * The abstract init method that initializes the tracking provider third party library
   *
   * @returns {void}
   */
  protected abstract init(): void;

  /**
   * The abstract method used on all tracking providers to actually trigger the event tracking
   *
   * @param data This is the event data that is send to the tracking provider
   * @returns {Promise<void>}
   */
  public abstract trackEvent(data?: any): Promise<void>;

  /**
   * The abstract method used on all tracking providers to actually trigger the page view
   *
   * @param data This is the page view data that is send to the tracking provider
   * @returns {Promise<void>}
   */
  public abstract trackPageView(data?: any): Promise<void>;
}

export default AbstractTrackingProvider;
