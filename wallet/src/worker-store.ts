// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { EventHandlerResultType } from './models/EventHandler';
import * as NativeFileSystemAdapter from 'native-file-system-adapter';
import type { EventHandlerResponseType } from './models/EventHandler';

async function storeData (credentialHandlerEvent): Promise<void> {
  const certificate = credentialHandlerEvent.credential;
  const result = await fetch('http://localhost:4555/store', {
    method: 'POST',
    body: JSON.stringify({
      certificate
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(response => response.json());

  if (result.status === 200) {
    // @ts-ignore
    credentialHandlerEvent.respondWith<EventHandlerResponseType>({
      type: EventHandlerResultType.Response,
      dataType: 'VerifiableCredential',
      data: JSON.stringify(certificate)
    });
  } else {
    console.error(result);
  }
}

async function storeToDevice(credentialHandlerEvent): Promise<void> {
  const certificate = credentialHandlerEvent.credential.data;
  const fileHandle = await NativeFileSystemAdapter.showSaveFilePicker({
    _preferPolyfill: false,
    suggestedName: `${certificate.credentialSubject?.claim?.name ?? certificate.id}.json`,
    types: [
      { accept: { 'text/json': [ 'json' ] } }
    ],
    excludeAcceptAllOption: false // default
  });

  const writer = await fileHandle.createWritable();
  await writer.write(JSON.stringify(certificate));
  await writer.close();
  console.log('closing');
  // @ts-ignore
  credentialHandlerEvent.respondWith<EventHandlerResponseType>({
    type: EventHandlerResultType.Response,
    dataType: 'VerifiableCredential',
    data: JSON.stringify(certificate)
  });
}

async function handleStoreEvent () {
  const credentialHandlerEvent = await WebCredentialHandler.receiveCredentialEvent();
  console.log('Wallet processing store() event:', credentialHandlerEvent);
  document
    .getElementsByClassName('js-store-server')[0]
    .addEventListener('click', storeData.bind(null, credentialHandlerEvent));
  document
    .getElementsByClassName('js-store-device')[0]
    .addEventListener('click', storeToDevice.bind(null, credentialHandlerEvent));
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
