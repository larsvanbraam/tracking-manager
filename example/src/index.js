/* eslint-disable no-new */
import Vue from 'vue/dist/vue.esm';
import TrackingProvider from './TrackingProvider';
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

// Globally expose some objects so we can run tests against them.
window.cypress = {};

/* global hljs */
new Vue({
  el: '#app',
  data: {
    providers: [
      {
        constructor: BingProvider,
        id: TrackingProvider.BING_PROVIDER,
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
        id: TrackingProvider.ENSIGHTEN_PROVIDER,
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
        id: TrackingProvider.FACEBOOK_PROVIDER,
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
        id: TrackingProvider.FORENSICS_PROVIDER,
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
        id: TrackingProvider.GOOGLE_ANALYTICS_PROVIDER,
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
        id: TrackingProvider.GOOGLE_GLOBAL_SITE_TAG_MANAGER_PROVIDER,
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
        id: TrackingProvider.HOTJAR_PROVIDER,
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
        id: TrackingProvider.LINKED_IN_PROVIDER,
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
        id: TrackingProvider.MEDIA_MATH_PROVIDER,
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
        id: TrackingProvider.NATIVO_PROVIDER,
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
        id: TrackingProvider.PARDOT_PROVIDER,
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
        id: TrackingProvider.TWITTER_PROVIDER,
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
  },
  mounted() {
    // Highlight the code
    Array.from(document.body.querySelectorAll('pre')).forEach(element => {
      hljs.highlightBlock(element);
    });

    this.trackingManager = new TrackingManager();

    // Expose for cypress
    window.cypress.trackingManager = this.trackingManager;

    // Initialise all the providers
    this.providers.forEach(provider => {
      const instance = new provider.constructor(provider.options);
      // Mark it as ready once it's loaded
      instance.providerReady
        .then(() => Vue.set(provider, 'ready', true))
        .catch(() => Vue.set(provider, 'ready', false));
      // Add it to the tracking manager
      this.trackingManager.addProvider(provider.id, instance);

      // Expose for cypress
      window.cypress[provider.id] = instance;
    });
  },
  methods: {
    handleTrackEvent(providerId, data) {
      return this.trackingManager.trackEvent({
        [providerId]: data,
      });
    },
    handleTrackPageView(providerId, data) {
      return this.trackingManager.trackPageView({
        [providerId]: data,
      });
    },
  },
});
