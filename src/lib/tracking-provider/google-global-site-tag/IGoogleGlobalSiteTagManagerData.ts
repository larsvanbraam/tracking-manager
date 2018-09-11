export interface IGoogleGlobalSiteTagManagerProviderOptions {
  /**
   * This is the namespace in which the instance of the global site tag manager will run, you can initialize multiple
   * instances by providing different namespaces.
   */
  namespace: string;
  /**
   * This is the tracking id provided by Google
   */
  trackingId: string;
}

export interface IGoogleGlobalSiteTagManagerTrackEventData {
  /**
   * This is the name of the event that you want to track.
   */
  event?: string;
  /**
   * This is any extra data dat you want to pass along with the event.
   */
  data?: any;
}
