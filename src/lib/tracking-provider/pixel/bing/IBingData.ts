export interface IBingProviderOptions {
  /**
   * The id of the tracking pixel
   */
  trackingPixelId: string;
}

export interface IBingTrackEventData {
  /**
   * The category of event you want to track. For example, 'video.'
   */
  ec: string;

  /**
   * The type of user interaction you want to track. For example 'play' or 'pause' etc.
   */
  ea: string;

  /**
   * The name of the element that caused the action. For example 'trailer' or 'behindthescenes' etc.
   */
  el: string;

  /**
   * A numerical value associated with that event. For example, the length of the video played, etc.
   */
  ev: number;
}
