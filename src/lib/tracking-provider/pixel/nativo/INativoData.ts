export interface INativoProviderOptions {
  /**
   * The tracking id used to load the api.
   */
  trackingPixelId: string;
}

export interface INativoTrackEventData {
  /**
   * An optional float that can be added to the track event call
   */
  value?: number;
}
