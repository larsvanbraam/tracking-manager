import AbstractTrackingProvider from './tracking-provider/AbstractTrackingProvider';

interface ITrackingManagerOptions {
  providers: { [id: string]: AbstractTrackingProvider<any> };
}

export default ITrackingManagerOptions;
