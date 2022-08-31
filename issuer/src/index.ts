import certificate from '../data/testnet-v3-did.json';
import { loadPolyfillOnce } from '../../wallet/src/helpers/loadPolyfillOnce';
// @ts-ignore
import { WebCredential } from 'credential-handler-polyfill';

async function sendCredential (): Promise<void> {
  const webCredential = new WebCredential(
    'VerifiableCredential',
    certificate
  );
  const result = await navigator.credentials.store(webCredential);
  console.log(result);
}

function init (): void {
  loadPolyfillOnce();
  document
    .getElementsByClassName('js-get-certificate')[0]
    .addEventListener('click', sendCredential);
}

init();
