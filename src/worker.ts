// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
import { loadPolyfillOnce } from './helpers/loadPolyfillOnce';

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

  loadPolyfillOnce();

  WebCredentialHandler
    .activateHandler({
      async get (event): Promise<EventHandlerResponseType> {
        console.log('WCH: Received get() event:', event);
        return {
          type: EventHandlerResultType.Redirect,
          url: './wallet-worker-get.html'
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
