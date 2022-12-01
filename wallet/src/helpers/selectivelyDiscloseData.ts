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

function createDisclosableCert (e) {
  e.preventDefault();
  e.stopPropagation();
  const checked = e.target.querySelectorAll('input[type="checkbox"]:checked');
  const values = Array.from(checked).map(checkbox => (checkbox as any).value);
  console.log(values);
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

function displayDisclosableData (data: DisclosableData[], anchorElement: Element, useModal = true, parentLabel: string = '') {
  const list = document.createElement('ul');
  data.forEach(entry => {
    const listItem = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    if (typeof entry.value === "object") {
      label.innerText = entry.key;
      listItem.appendChild(label);
      parentLabel = entry.key;
      displayDisclosableData(getDisclosableData(entry.value), listItem, false, parentLabel);
    } else {
      checkbox.type = 'checkbox';
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
    anchorElement.addEventListener('submit', createDisclosableCert, false);
    makeModal(list);
  }
  anchorElement.appendChild(list);
}

export default async function selectivelyDiscloseData (certificate) {
  const disclosableData = getDisclosableData(certificate.credentialSubject);
  const anchorElement = document.getElementsByClassName('js-selective-disclosure')[0];
  anchorElement.classList.remove('hidden');
  anchorElement.classList.add('visible', 'modal');
  displayDisclosableData(disclosableData, anchorElement);
}
