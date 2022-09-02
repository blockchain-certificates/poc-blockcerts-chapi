// @ts-ignore
import * as WebCredentialHandler from 'web-credential-handler';
// @ts-ignore
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { EventHandlerResultType } from './models/EventHandler';
import type { EventHandlerResponseType } from './models/EventHandler';

async function sendData (credentialHandlerEvent): Promise<void> {
  const serverUrl = new URL('http://localhost:4555/get');
  serverUrl.searchParams.append('id', 'urn:uuid:13172c8c-efa5-49e1-9f69-a67ba6bd9937');
  const result = await fetch(serverUrl.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => response.json());

  if (result.status === 200) {
    credentialHandlerEvent.respondWith<EventHandlerResponseType>({
      type: EventHandlerResultType.Response,
      dataType: 'VerifiableCredential',
      data: result.certificate
    });
  } else {
    console.error(result);
  }
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

function displayList (list): void {
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
    listItem.appendChild(definitionList);
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
  console.log(result);
  const availableCredentials = result.list;

  if (availableCredentials?.length) {
    displayList(availableCredentials);
  }

  document
    .getElementsByClassName('js-share-ok')[0]
    .addEventListener('click', sendData.bind(null, credentialHandlerEvent));
}

async function init (): Promise<void> {
  CredentialHandlerPolyfill
    .loadOnce()
    .then(handleGetEvent)
}

init();
