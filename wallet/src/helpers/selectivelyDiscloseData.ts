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

async function createDisclosableCert (signedDocument, e) {
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
  contentElement.classList.add('modal__content');
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
   signedDocument
  }: {
    data: DisclosableData[];
    anchorElement: Element;
    useModal?: boolean;
    parentLabel?: string;
    signedDocument?: any;
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
    anchorElement.addEventListener('submit', createDisclosableCert.bind(null, signedDocument), false);
    makeModal(list);
  }
  anchorElement.appendChild(list);
}

export default async function selectivelyDiscloseData (certificate) {
  const disclosableData = getDisclosableData(certificate.credentialSubject);
  const anchorElement = document.getElementsByClassName('js-selective-disclosure')[0];
  anchorElement.classList.remove('hidden');
  anchorElement.classList.add('visible', 'modal');
  displayDisclosableData({
    data: disclosableData,
    anchorElement,
    signedDocument: certificate
  });
}
