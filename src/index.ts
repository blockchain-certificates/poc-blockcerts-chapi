// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
import { loadPolyfillOnce } from './helpers/loadPolyfillOnce';

async function init (): Promise<void> {
  loadPolyfillOnce();

  WebCredentialHandler
    .installHandler()
    .then(console.log('Wallet installed'))
    .catch(e => console.error('Error installing wallet', e));
}

init();
