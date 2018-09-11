export interface IGoogleAnalyticsProviderOptions {
  /**
   * The id that is used to initialise Google Analytics, make sure your api key supports the ga methods instead of _gaq
   */
  trackingId: string;
}

export interface IGoogleAnalyticsPageViewData {
  /**
   * The page that should be tracked
   */
  page: string;
}

export interface IGoogleAnalyticsTrackEventData {
  /**
   * The event category that should be tracked
   */
  category: string;

  /**
   * The event action that should be tracked
   */
  action: string;

  /**
   * The event label that should be tracked
   */
  label?: string;

  /**
   * The event value that should be tracked
   */
  value?: number;
}
