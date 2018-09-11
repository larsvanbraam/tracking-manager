export interface IEnsightenProviderOptions {
  /**
   * The name of the Ensighten project owner, this is used to load the correct Bootstrap.js file.
   */
  trackingName: string;

  /**
   * The id of the ensighten project, this is used to load the correct Bootstrap.js file.
   */
  trackingId: string;

  /**
   * The name of the starting page that is loaded.
   */
  pageName: string;
}

export interface IEnsightenPageViewData {
  /**
   * The page that should be tracked
   */
  page: string;
  /**
   * The Ensighten page that should be tracked
   */
  ensightenPage: string;
}

export interface IEnsightenTrackEventData {
  /**
   * The name of the element that the event was performed on
   */
  elementName?: string;

  /**
   * The name of the event that should be tracked
   */
  eventName?: string;

  /**
   * The name of the eVar variable
   */
  eVarName?: string;

  /**
   * The value of the eVar variable
   */
  eVarValue?: string;

  /**
   * The name of the prop
   */
  propName?: string;
}
