import debug from 'debug';
import { IEnsightenProviderOptions, IEnsightenTrackEventData, IEnsightenPageViewData } from './IEnsightenProviderData';
import AbstractApiTrackingProvider from '../AbstractApiTrackingProvider';
import TrackingManager from '../../TrackingManager';

export default class EnsightenProvider extends AbstractApiTrackingProvider<IEnsightenProviderOptions> {
  /**
   * The current page name is stored so we can pass it at the next event
   */
  private pageName: string = '';

  /**
   * The previous page name is stored
   */
  private previousPageName: string = '';

  /**
   * The init method that initializes the tracking provider
   *
   * @returns {void}
   */
  protected init(): void {
    this.logger = debug(`${TrackingManager.LOG_NAMESPACE}:ensighten`);

    // Set the default page name
    window['adobePageNameOverride'] = this.providerOptions.pageName;

    this.loadApi(
      `//nexus.ensighten.com/${this.providerOptions.trackingName}/${
        this.providerOptions.trackingId
      }/Bootstrap.js`,
    );
  }

  /**
   * The method that actually triggers the tracking of the event
   *
   * @returns { Promise<void> }
   */
  public trackEvent(data: IEnsightenTrackEventData): Promise<void> {
    return this.providerReady
      .then(
        () =>
          new Promise(resolve => {
            try {
              const s = window['s'];

              s.origLTV = s.linkTrackVars;
              s.origEvents = s.events;

              // Fire default event
              s.prop74 = '80YOM';
              s.linkTrackVars = s.apl(s.linkTrackVars, 'prop74', ',', 2);
              s.eVar74 = '80YOM';
              s.linkTrackVars = s.apl(s.linkTrackVars, 'eVar74', ',', 2);

              if (this.pageName) {
                s.pageName = this.pageName;
                s.eVar1 = this.pageName;
                s.eVar2 = this.previousPageName;
              }

              // Check if data contains eventName
              if (data.eventName) {
                s.events = s.apl(s.events, data.eventName, ',', 2);
                s.linkTrackEvents = data.eventName;
                s.linkTrackVars = s.apl(s.linkTrackVars, 'events', ',', 2);
              }

              // Check if data contains eVarName
              if (data.eVarName) {
                if (data.propName) {
                  s[data.propName] = data.eVarValue;
                  s.linkTrackVars = s.apl(s.linkTrackVars, data.propName, ',', 2);
                }

                s[data.eVarName] = data.eVarValue;
                s.linkTrackVars = s.apl(s.linkTrackVars, data.eVarName, ',', 2);
                s.tl(data.elementName, 'o', data.eVarValue);
              } else {
                s.tl(true, 'o', data.eventName);
              }

              // Reset to original values
              delete s[data.propName];
              delete s[data.eVarName];
              delete s[data.eVarValue];
              delete s.eVar1;
              delete s.eVar2;
              delete s.prop74;
              delete s.eVar74;

              s.linkTrackEvents = 'None';
              s.linkTrackVars = s.origLTV;
              s.events = s.origEvents;

              // When the element is set the stringify fails so we omit it from the log
              data['elementName'] = 'Removed element instance for logging purposes';

              resolve();
            } catch (e) {
              this.logger(`failed to trigger event, ${e}`);
            }
          }),
      )
      .then(() => this.logger(`trackEvent: ${JSON.stringify(data)}`));
  }

  /**
   * The method that actually triggers the tracking of the page view
   *
   * @returns { Promise<void> }
   */
  public trackPageView(data: IEnsightenPageViewData): Promise<void> {
    return this.providerReady
      .then(() => {
        this.previousPageName = this.pageName;
        this.pageName = data.ensightenPage;

        return new Promise(resolve => {
          try {
            const s = window['s'];

            if (this.pageName) {
              this.logger(`Add pagename: ${this.pageName}`);
              this.logger(`Set eVar1 pageName: ${this.pageName}`);
              this.logger(`Set eVar2 previousPageName: ${this.previousPageName}`);
              s.pageName = (<any>window).adobePageNameOverride = this.pageName;
              s.eVar1 = this.pageName;
              s.eVar2 = this.previousPageName;
              s.linkTrackVars = s.apl(s.linkTrackVars, 'pageName', ',', 2);
              s.linkTrackVars = s.apl(s.linkTrackVars, 'eVar1', ',', 2);
              s.linkTrackVars = s.apl(s.linkTrackVars, 'eVar2', ',', 2);
            }
            s.t();

            resolve();
          } catch (e) {
            this.logger(`failed to trigger pagetrack, ${e}`);
          }
        });
      })
      .then(() => this.logger(`trackPageView: ${JSON.stringify(data)}`));
  }
}
