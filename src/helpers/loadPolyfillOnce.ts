// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';

export function loadPolyfillOnce () {
  CredentialHandlerPolyfill
    .loadOnce()
    .then(console.log('Polyfill loaded.'))
    .catch(e => console.error('Error loading polyfill:', e));
}
