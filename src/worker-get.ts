// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
import { loadPolyfillOnce } from './helpers/loadPolyfillOnce';

function init (): void {
  loadPolyfillOnce();
  document
    .getElementsByClassName('js-share-ok')[0]
    .addEventListener('click', function () {
      console.log('share ok');
    });
}

init();
