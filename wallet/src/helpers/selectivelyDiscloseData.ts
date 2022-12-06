interface DisclosableData {
  key: string;
  value: string;
}

function getDisclosableData (claim): DisclosableData[] {
  return Object.keys(claim).map(claimKey => {
    return {
      key: claimKey,
      value: claim[claimKey]
    }
  });
}

function handleCloseModal (e) {
  e.preventDefault();
  e.stopPropagation();
  const anchorElement = document.getElementsByClassName('js-selective-disclosure')[0];
  anchorElement.classList.remove('visible');
  anchorElement.classList.add('hidden');
  anchorElement.innerHTML = '';
}

function createCloseButton (): Element {
  const closeButton = document.createElement('button');
  closeButton.classList.add('btn-close');
  closeButton.innerText = 'Cancel';
  closeButton.addEventListener('click', handleCloseModal);
  return closeButton;
}

function createRevealDocument (keys: string[]): any {
  const EXPLICIT_KEY = '@explicit';
  const VCTemplate = {
    // TODO: context should be reused from original document
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/blockcerts/v3",
      "https://w3id.org/security/bbs/v1"
    ],
    // TODO: type should be reused from original document
    "type": ["VerifiableCredential", "BlockcertsCredential"],
    "credentialSubject": {
      "@explicit": true
    }
  }
  keys.forEach(key => {
    // TODO: . should be a constant variable
    if (!key.includes('.')) {
      if (!VCTemplate.credentialSubject[EXPLICIT_KEY]) {
        VCTemplate.credentialSubject[EXPLICIT_KEY] = true;
      }
       VCTemplate.credentialSubject[key] = {}
    } else {
      let current = VCTemplate.credentialSubject;
      // TODO: . should be a constant variable
      for (const pathItem of key.split('.')) {
        if (pathItem !== '') {
          if (!(pathItem in current)) {
            if (!current[EXPLICIT_KEY]) {
              current[EXPLICIT_KEY] = true;
            }
            current[pathItem] = {};
          }

          current = current[pathItem];
        }
      }
    }
  });

  return VCTemplate;
}

async function createDisclosableCert (signedDocument, cb, e) {
  e.preventDefault();
  e.stopPropagation();
  const checked = e.target.querySelectorAll('input[type="checkbox"]:checked');
  const chosenKeys = Array.from(checked).map(checkbox => (checkbox as any).value);
  const revealDocument = createRevealDocument(chosenKeys);
  console.log(revealDocument);

  const { derivedDocument } = await fetch('http://localhost:4666/derive', {
    method: 'POST',
    body: JSON.stringify({
      revealDocument,
      signedDocument
    })
  }).then(res => res.json());

  console.log(derivedDocument);
  cb(JSON.stringify(derivedDocument));
}

function createSubmitButton (): Element {
  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.classList.add('btn-submit');
  submitButton.innerText = 'Confirm and share';
  return submitButton;
}

function createModalTitle (): Element {
  const title = document.createElement('h3');
  title.innerText = 'Select data you wish to disclose to the verifier';
  return title;
}

function makeModal (contentElement: Element): void {
  const title = createModalTitle();
  const closeButton = createCloseButton();
  const submitButton = createSubmitButton();
  contentElement.prepend(title);
  contentElement.append(closeButton);
  contentElement.append(submitButton);
}

function displayDisclosableData ({
   data,
   anchorElement,
   useModal = true,
   parentLabel = '',
   signedDocument,
   derivationCb
  }: {
    data: DisclosableData[];
    anchorElement: Element;
    useModal?: boolean;
    parentLabel?: string;
    signedDocument?: any;
    derivationCb?: (derivedCert: any) => any
  }) {
  const list = document.createElement('ul');
  data.forEach(entry => {
    const listItem = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    if (typeof entry.value === "object") {
      label.innerText = entry.key;
      listItem.appendChild(label);
      parentLabel = entry.key;
      displayDisclosableData({
        data: getDisclosableData(entry.value),
        anchorElement: listItem,
        useModal: false,
        parentLabel
      });
    } else {
      checkbox.type = 'checkbox';
      // TODO: next 3 lines . should be a constant variable
      checkbox.value = parentLabel ? `${parentLabel}.${entry.key}` : entry.key;
      checkbox.id = parentLabel ? `${parentLabel}.${entry.key}` : entry.key;
      label.htmlFor = parentLabel ? `${parentLabel}.${entry.key}` : entry.key;
      label.innerText = entry.value;
      label.prepend(checkbox);
      listItem.appendChild(label);
    }
    list.appendChild(listItem);
  });
  if (useModal === true) {
    anchorElement.addEventListener(
      'submit',
      createDisclosableCert.bind(null, signedDocument, derivationCb),
      false
    );
    makeModal(list);
  }
  anchorElement.appendChild(list);
}

function handleTabChange (e) {
  const targetButton = e.target;
  const targetTab = targetButton.getAttribute('data-target');
  const targetElement = document.getElementsByClassName(targetTab)[0];
  const otherTabs = document.getElementsByClassName('js-tab')
  Array.from(otherTabs).forEach(tab => tab.classList.add('hidden'));
  const otherTabButtons = document.getElementsByClassName('js-tab-button');
  Array.from(otherTabButtons).forEach(button => button.classList.add('is-inactive'));
  targetButton.classList.remove('is-inactive');
  targetElement.classList.remove('hidden');
}

function createTabs (elements: any[], targetElement: Element) {
  const tabList = document.createElement('menu');
  tabList.classList.add('c-tab-menu', 'modal__content');
  elements.forEach((el, index) => {
    const { element, title } = el;
    const switchElement = document.createElement('button');
    switchElement.innerText = title;
    switchElement.classList.add('js-tab-button', 'c-tab-button');
    const generalTabClass = 'js-tab';
    const targetClass = `tab-content-${title.toLowerCase().replace(' ', '-')}`;
    switchElement.setAttribute('data-target', targetClass);
    element.classList.add(targetClass, generalTabClass);
    switchElement.addEventListener('click', handleTabChange, false);
    if (index > 0) {
      element.classList.add('hidden');
      switchElement.classList.add('is-inactive');
    }
    tabList.append(switchElement)
  });
  targetElement.prepend(tabList);
}

export default async function selectivelyDiscloseData (certificate, derivationCb) {
  const disclosableData = getDisclosableData(certificate.credentialSubject);
  const modalElement = document.getElementsByClassName('js-selective-disclosure')[0];
  const anchorElement = document.getElementsByClassName('js-selective-disclosure__form')[0];
  const dataElement = document.getElementsByClassName('js-selective-disclosure__data')[0];
  dataElement.innerHTML = JSON.stringify(certificate, null, 2);
  modalElement.classList.remove('hidden');
  modalElement.classList.add('visible', 'modal');
  createTabs([{
    element: anchorElement,
    title: 'Select data'
  }, {
    element: dataElement,
    title: 'Raw data'
  }], modalElement);
  displayDisclosableData({
    data: disclosableData,
    anchorElement,
    signedDocument: certificate,
    derivationCb
  });
}
