/* eslint-disable no-new, import/no-extraneous-dependencies */
import Vue from 'vue/dist/vue.esm';
import debug from 'debug';
import TealiumProvider from '../../src/lib/tracking-provider/tealium/TealiumProvider';
import BingProvider from '../../src/lib/tracking-provider/pixel/bing/BingProvider';
import EnsightenProvider from '../../src/lib/tracking-provider/ensighten/EnsightenProvider';
import FacebookProvider from '../../src/lib/tracking-provider/pixel/facebook/FacebookProvider';
import ForensicsProvider from '../../src/lib/tracking-provider/forensics/ForensicsProvider';
import GoogleAnalyticsProvider from '../../src/lib/tracking-provider/google-analytics/GoogleAnalyticsProvider';
import GoogleGlobalSiteTagManagerProvider from '../../src/lib/tracking-provider/google-global-site-tag/GoogleGlobalSiteTagManagerProvider';
import HotjarProvider from '../../src/lib/tracking-provider/hotjar/HotjarProvider';
import LinkedInProvider from '../../src/lib/tracking-provider/pixel/linkedin/LinkedInProvider';
import MediaMathProvider from '../../src/lib/tracking-provider/media-math/MediaMathProvider';
import NativoProvider from '../../src/lib/tracking-provider/pixel/nativo/NativoProvider';
import PardotProvider from '../../src/lib/tracking-provider/pardot/PardotProvider';
import TwitterProvider from '../../src/lib/tracking-provider/pixel/twitter/TwitterProvider';
import TrackingManager from '../../src/lib/TrackingManager';

new Vue({
  el: '#app',
  data: {
    providers: [
      {
        constructor: TealiumProvider,
        id: 'TealiumProvider',
        ready: false,
        options: {
          url: 'https://tags.tiqcdn.com/utag/foo/bar/dev/utag.js',
          pageCategory: 'bar',
          pageName: 'fooPage',
        },
        data: {
          event: {
            page_category: 'foo',
            page_event: 'bar',
          },
          pageView: {
            event_category: 'foo',
            event_name: 'bar',
          },
        },
      },
      {
        constructor: BingProvider,
        id: 'BingTrackingPixelProvider',
        ready: false,
        options: {
          trackingPixelId: '00000',
        },
        data: {
          event: {
            ec: 'video',
            ea: 'play',
            el: 'trailer',
            ev: 1,
          },
          pageView: {},
        },
      },
      {
        constructor: EnsightenProvider,
        id: 'EnsightenProvider',
        ready: false,
        options: {
          trackingName: 'foo',
          pageName: 'bar',
          trackingId: '00000',
        },
        data: {
          event: {
            elementName: 'foo',
            eventName: 'bar',
            eVarName: 'foo',
            eVarValue: 'bar',
            propName: 'foo',
          },
          pageView: {
            page: 'foo',
            ensightenPage: 'bar',
          },
        },
      },
      {
        constructor: FacebookProvider,
        id: 'FacebookTrackingPixelProvider',
        ready: false,
        options: {
          trackingPixelId: '00000',
        },
        data: {
          event: {
            event: 'ViewContent',
            parameters: {
              value: 'foo',
            },
          },
          pageView: {},
        },
      },
      {
        constructor: ForensicsProvider,
        id: 'ForensicsProvider',
        ready: false,
        options: {
          trackingId: '00000',
        },
        data: {
          event: {},
          pageView: {},
        },
      },
      {
        constructor: GoogleAnalyticsProvider,
        id: 'GoogleAnalyticsProvider',
        ready: false,
        options: {
          trackingId: '00000',
        },
        data: {
          event: {
            category: 'foo',
            action: 'bar',
            label: 'foo',
            value: 1,
          },
          pageView: {
            page: 'foo',
          },
        },
      },
      {
        constructor: GoogleGlobalSiteTagManagerProvider,
        id: 'GoogleGlobalSiteTagProvider',
        ready: false,
        options: {
          namespace: 'foo',
          trackingId: '00000',
        },
        data: {
          event: {
            event: 'foo',
            data: {
              foo: 'bar',
            },
          },
          pageView: {
            page: {
              foo: 'bar',
            },
          },
        },
      },
      {
        constructor: HotjarProvider,
        id: 'HotjarProvider',
        ready: false,
        options: {
          trackingId: '00000',
        },
        data: {
          event: {},
          pageView: {},
        },
      },
      {
        constructor: LinkedInProvider,
        id: 'LinkedInTrackingPixelProvider',
        ready: false,
        options: {
          trackingPixelId: '00000',
        },
        data: {
          event: {},
          pageView: {},
        },
      },
      {
        constructor: MediaMathProvider,
        id: 'MediaMathProvider',
        ready: false,
        options: {
          trackingId: '00000',
        },
        data: {
          event: {},
          pageView: {},
        },
      },
      {
        constructor: NativoProvider,
        id: 'NativoTrackingPixelProvider',
        ready: false,
        options: {
          trackingPixelId: '00000',
        },
        data: {
          event: {},
          pageView: {},
        },
      },
      {
        constructor: PardotProvider,
        id: 'PardotProvider',
        ready: false,
        options: {
          clientId: '00000',
          applicationId: '00000',
          hostname: 'foo.bar',
        },
        data: {
          event: {},
          pageView: {},
        },
      },
      {
        constructor: TwitterProvider,
        id: 'TwitterTrackingPixelProvider',
        ready: false,
        options: {
          trackingPixelId: '00000',
        },
        data: {
          event: {
            event: 'ViewContent',
            parameters: {
              value: 'foo',
            },
          },
          pageView: {},
        },
      },
    ],
    logs: [],
  },
  created() {
    // Force enable the tracking manager logs
    debug.enabled('TrackingManager:*');
    // We want to display the debug logs in the DOM
    this.hijackLogs();
  },
  mounted() {
    // Highlight the code
    Array.from(document.body.querySelectorAll('pre')).forEach(element => {
      window.hljs.highlightBlock(element);
    });

    this.trackingManager = new TrackingManager();

    // Initialise all the providers
    this.providers.forEach(provider => {
      const instance = new provider.constructor(provider.options);
      // Mark it as ready once it's loaded
      instance.providerReady
        .then(() => Vue.set(provider, 'ready', true))
        .catch(() => Vue.set(provider, 'ready', false));
      // Add it to the tracking manager
      this.trackingManager.addProvider(provider.id, instance);
    });
  },
  methods: {
    handleTrackEvent(providerId, data) {
      this.trackingManager.trackEvent({
        [providerId]: data,
      });
    },
    handleTrackPageView(providerId, data) {
      this.trackingManager.trackPageView({
        [providerId]: data,
      });
    },
    hijackLogs() {
      // hijack the console.log method for example purposes
      const cl = console.log;
      window.console.log = (...args) => {
        const values = args[0].split('%c');

        // Strip out the first and last item because they contain white space and a %c character
        values.shift();
        values.pop();

        this.logs.unshift({
          namespace: values[0],
          value: values[1],
          data: values[2],
        });

        cl.apply(this, args);
      };
    },
  },
});
