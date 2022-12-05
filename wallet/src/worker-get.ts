// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { EventHandlerResultType } from './models/EventHandler';
import type { EventHandlerResponseType } from './models/EventHandler';
import selectivelyDiscloseData from "./helpers/selectivelyDiscloseData";

export const BBS_PLUS_SIGNATURE = 'BbsBlsSignature2020';
export const BBS_PLUS_DERIVED_SIGNATURE = 'BbsBlsSignatureProof2020';

async function sendData (credentialHandlerEvent, id): Promise<void> {
  const serverUrl = new URL('http://localhost:4555/get');
  serverUrl.searchParams.append('id', id);
  const result = await fetch(serverUrl.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => response.json());

  if (result.status === 200) {
    const certData = JSON.parse(result.certificate);
    if (certData.proof.type === BBS_PLUS_SIGNATURE) {
      // TODO: do not keep this here, split get credential and send credential to plug this part in between
      function certDerivedCallback (derivedCert) {
        // @ts-ignore
        credentialHandlerEvent.respondWith<EventHandlerResponseType>({
          type: EventHandlerResultType.Response,
          dataType: 'VerifiableCredential',
          data: derivedCert
        });
      }
      const data = await selectivelyDiscloseData(certData, certDerivedCallback);
      console.log(data);
      return;
    }
    console.log('send');
    // @ts-ignore
    credentialHandlerEvent.respondWith<EventHandlerResponseType>({
      type: EventHandlerResultType.Response,
      dataType: 'VerifiableCredential',
      data: result.certificate
    });
  } else {
    console.error(result);
  }
}

async function getFromDevice (credentialHandlerEvent, e): Promise<void> {
  const [file] = e.target.files;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    // @ts-ignore
    credentialHandlerEvent.respondWith<EventHandlerResponseType>({
      type: EventHandlerResultType.Response,
      dataType: 'VerifiableCredential',
      data: reader.result
    });
  }, false);
  reader.readAsText(file);
}

function createDefinitionEntry (listItem, property): HTMLElement {
  const wrapper = document.createElement('div');
  const nameDefinitionTitle = document.createElement('dt');
  nameDefinitionTitle.innerText = property.title;
  const nameDefinitionDetail = document.createElement('dd');
  nameDefinitionDetail.innerText = listItem[property.key];
  wrapper.appendChild(nameDefinitionTitle);
  wrapper.appendChild(nameDefinitionDetail);
  return wrapper;
}

function displayList (list, credentialHandlerEvent): void {
  const root = document.getElementsByClassName('js-credential-list')[0];
  for (const entry of list) {
    const definitionList = document.createElement('dl');
    const displayProperties = [
      {
        key: 'name',
        title: 'Name of Certificate'
      },
      {
        key: 'issuanceDate',
        title: 'Issued on'
      },
      {
        key: 'issuerName',
        title: 'by'
      }
    ];
    const children = [];
    for (const displayProperty of displayProperties) {
      children.push(createDefinitionEntry(entry, displayProperty));
    }
    children.forEach(child => definitionList.appendChild(child));
    const listItem = document.createElement('li');
    listItem.classList.add('c-credential');
    listItem.appendChild(definitionList);
    listItem.addEventListener('click', sendData.bind(null, credentialHandlerEvent, entry.id));
    root.appendChild(listItem);
  }
}

async function handleGetEvent () {
  const credentialHandlerEvent = await WebCredentialHandler.receiveCredentialEvent();
  console.log('Wallet processing get() event:', credentialHandlerEvent);
  const serverUrl = new URL('http://localhost:4555/list');
  const result = await fetch(serverUrl.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
  const availableCredentials = result.list;

  document.getElementsByClassName('js-get-from-device')[0]
    .addEventListener('change', getFromDevice.bind(null, credentialHandlerEvent));

  if (availableCredentials?.length) {
    displayList(availableCredentials, credentialHandlerEvent);
  } else {
    const listWrapper = document.getElementsByClassName('js-credential-list-wrapper')[0];
    (listWrapper as HTMLElement).innerText = 'No credential stored in this wallet';
  }
}

async function init (): Promise<void> {
  CredentialHandlerPolyfill
    .loadOnce()
    .then(handleGetEvent)
}

init();
