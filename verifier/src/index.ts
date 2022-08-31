import { loadPolyfillOnce } from '../../wallet/src/helpers/loadPolyfillOnce';
import type { EventHandlerResponseType } from '../../wallet/src/models/EventHandler';

interface CredentialRequestOptions {
  web: {
    // these types need to map to the manifest.json types of the wallet
    // they don't have to be booleans, it seems they could hold more specific/filtering information. To be confirmed
    VerifiablePresentation?: boolean;
    VerifiableCredential?: boolean;
  };
}

function verifyCredential (credential) {
  const verifier = document.getElementsByClassName('js-verifier')[0];
  verifier.src = credential;
}

function init () {
  console.log('verifier page');
  loadPolyfillOnce();

  document
    .getElementsByClassName('js-share-credential-btn')[0]
    .addEventListener('click', async function () {
      console.log('share credential');
      const credentialQuery: CredentialRequestOptions = {
        web: {
          VerifiableCredential: true
        }
      };
      const webCredential: EventHandlerResponseType = await navigator.credentials.get(credentialQuery);
      verifyCredential(webCredential.data);
    });
}

init();
