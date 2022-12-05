import { loadPolyfillOnce } from '../../wallet/src/helpers/loadPolyfillOnce';
import { BBS_PLUS_DERIVED_SIGNATURE } from '../../wallet/lib/get/worker-get';
import verifyDerivedBBSPlus from './verify-derived-bbs-plus';

interface CredentialRequestOptions {
  web: {
    // these types need to map to the manifest.json types of the wallet
    // they don't have to be booleans, it seems they could hold more specific/filtering information. To be confirmed
    VerifiablePresentation?: boolean;
    VerifiableCredential?: boolean;
  };
}

function verifyCredential (credential) {
  const parsedCredential = JSON.parse(credential);
  console.log('pass this to verifier', credential);
  if (parsedCredential.proof.type === BBS_PLUS_DERIVED_SIGNATURE) {
    verifyDerivedBBSPlus(credential);
    return;
  }
  const verifier = document.getElementsByClassName('js-verifier')[0];
  (verifier as any).src = credential;
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
      const webCredential: any = await navigator.credentials.get(credentialQuery as any);
      verifyCredential(webCredential.data);
    });
}

init();
