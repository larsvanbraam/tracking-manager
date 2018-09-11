export interface IFacebookProviderOptions {
  /**
   * The tracking pixel id that is provided by Facebook
   */
  trackingPixelId: string;
}

export interface IFacebookTrackEventData {
  /**
   * The set of events that are supported by the Facebook tracking pixel
   */
  event?:
    | 'ViewContent'
    | 'Search'
    | 'AddToCart'
    | 'AddToWishlist'
    | 'InitiateCheckout'
    | 'AddPaymentInfo'
    | 'Purchase'
    | 'CompleteRegistration'
    | string;

  /**
   * The parameters object that is supported by the Facebook tracking pixel
   */
  parameters?: {
    value?: string;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string;
    contents?: string;
    content_type?: string;
    num_items?: string;
    search_string?: string;
    status?: string;
    [customValue: string]: string;
  };
}
