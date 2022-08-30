// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';

enum EventHandlerResultType {
  Response = 'response',
  Redirect = 'redirect'
}
interface EventHandlerResponse {
  type: EventHandlerResultType.Response;
  dataType: any;
  data: any;
}

interface EventHandlerRedirect {
  type: EventHandlerResultType.Redirect;
  url: string;
}

type EventHandlerResponseType = EventHandlerRedirect | EventHandlerResponse;

async function init (): Promise<void> {
  console.log('Worker page loaded');
  CredentialHandlerPolyfill
    .loadOnce()
    .then(console.log('Polyfill loaded.'))
    .catch(e => console.error('Error loading polyfill:', e));

  WebCredentialHandler
    .activateHandler({
      async get (event): Promise<EventHandlerResponseType> {
        console.log('WCH: Received get() event:', event);
        return {
          type: EventHandlerResultType.Response,
          data: '',
          dataType: ''
        };
      },
      async store(event): Promise<EventHandlerResponseType> {
        console.log('WCH: Received store() event:', event);
        return {
          type: EventHandlerResultType.Response,
          data: '',
          dataType: ''
        };
      }
    })
    .then(console.log('Wallet activated'))
    .catch(e => console.error('Error activating wallet', e));
}

init();
