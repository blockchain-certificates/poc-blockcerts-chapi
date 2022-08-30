// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';

async function init (): Promise<void> {
  const MEDIATOR = 'https://authn.io';
  CredentialHandlerPolyfill
    .loadOnce(MEDIATOR)
    .then(console.log('Polyfill loaded.'))
    .catch(e => console.error('Error loading polyfill:', e));

  WebCredentialHandler
    .installHandler()
    .then(console.log('Wallet installed'))
    .catch(e => console.error('Error installing wallet', e));
}

init();
