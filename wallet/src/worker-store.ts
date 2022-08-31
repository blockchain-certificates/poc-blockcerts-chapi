// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { EventHandlerResultType } from './models/EventHandler';
import type { EventHandlerResponseType } from './models/EventHandler';

function storeData (credentialHandlerEvent): void {
  const cert = credentialHandlerEvent.credential;
  console.log('ok storing cert', cert);
  credentialHandlerEvent.respondWith<EventHandlerResponseType>({
    type: EventHandlerResultType.Response,
    dataType: 'VerifiableCredential',
    data: JSON.stringify(cert)
  });
}

async function handleStoreEvent () {
  const credentialHandlerEvent = await WebCredentialHandler.receiveCredentialEvent();
  console.log('Wallet processing store() event:', credentialHandlerEvent);
  document
    .getElementsByClassName('js-store-ok')[0]
    .addEventListener('click', storeData.bind(null, credentialHandlerEvent));
}

async function init (): Promise<void> {
  console.log('init store page');
  CredentialHandlerPolyfill
    .loadOnce()
    .then(() => {
      console.log('polyfill loaded');
      handleStoreEvent();
    })
    .catch(e => console.error(e))
}

init();
