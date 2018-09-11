export interface ITealiumProviderOptions {
  /**
   * The url that is required to load the api
   */
  url: string;
  /**
   * The category of the landing page
   */
  pageCategory: string;
  /**
   * The name of the landing page
   */
  pageName: string;
}

export interface ITealiumPageViewData {
  /**
   * The category linked to the page, this can by any string
   */
  page_category: string;

  /**
   * The name linked to the page, this can by any string
   */
  page_name: string;
}

export interface ITealiumTrackEventData {
  /**
   * The category linked to the event, this can by any string
   */
  event_category: string;

  /**
   * The actual event name that should be tracked, this can by any string
   */
  event_name: string;

  /**
   * Any extra keys that need to be pushed to the tracking provider
   */
  [key: string]: string;
}
