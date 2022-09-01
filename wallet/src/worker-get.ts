// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { EventHandlerResultType } from './models/EventHandler';
import type { EventHandlerResponseType } from './models/EventHandler';

async function sendData (credentialHandlerEvent): Promise<void> {
  const serverUrl = new URL('http://localhost:4555/get');
  serverUrl.searchParams.append('id', 'urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937');
  const result = await fetch(serverUrl.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => response.json());

  if (result.status === 200) {
    credentialHandlerEvent.respondWith<EventHandlerResponseType>({
      type: EventHandlerResultType.Response,
      dataType: 'VerifiableCredential',
      data: result.certificate
    });
  } else {
    console.error(result);
  }
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
