import certificate from '../data/testnet-v3-did.json';

function init (): void {
  document
    .getElementsByClassName('js-get-certificate')[0]
    .addEventListener('click', function () {
      console.log('get the certificate', certificate);
    });
}

init();
