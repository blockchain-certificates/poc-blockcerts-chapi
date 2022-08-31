// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { EventHandlerResultType } from './models/EventHandler';
import cert from './data/testnet-v3-did.json';
import type { EventHandlerResponseType } from './models/EventHandler';

function sendData (credentialHandlerEvent): void {
  console.log('ok sending cert', cert);
  credentialHandlerEvent.respondWith<EventHandlerResponseType>({
    type: EventHandlerResultType.Response,
    dataType: 'VerifiableCredential',
    data: JSON.stringify(cert)
  });
}

async function handleGetEvent () {
  const credentialHandlerEvent = await WebCredentialHandler.receiveCredentialEvent();
  console.log('Wallet processing get() event:', credentialHandlerEvent);
  document
    .getElementsByClassName('js-share-ok')[0]
    .addEventListener('click', sendData.bind(null, credentialHandlerEvent));
}

async function init (): Promise<void> {
  CredentialHandlerPolyfill
    .loadOnce()
    .then(handleGetEvent)
}

init();
