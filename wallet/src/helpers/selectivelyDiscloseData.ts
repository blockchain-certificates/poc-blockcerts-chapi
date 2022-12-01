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

function displayDisclosableData (data: DisclosableData[], anchorElement: Element, useModal = true) {
  const list = document.createElement('ul');
  data.forEach(entry => {
    const listItem = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    if (typeof entry.value === "object") {
      label.innerText = entry.key;
      listItem.appendChild(label);
      displayDisclosableData(getDisclosableData(entry.value), listItem, false);
    } else {
      checkbox.type = 'checkbox';
      checkbox.value = entry.key;
      checkbox.id = entry.key;
      label.htmlFor = entry.key;
      label.innerText = entry.value;
      label.prepend(checkbox);
      listItem.appendChild(label);
    }
    list.appendChild(listItem);
    if (useModal === true) {
      list.classList.add('modal__content')
    }
  });
  anchorElement.appendChild(list);
}

export default async function selectivelyDiscloseData (certificate) {
  const disclosableData = getDisclosableData(certificate.credentialSubject);
  const anchorElement = document.getElementsByClassName('js-selective-disclosure')[0];
  anchorElement.classList.remove('hidden');
  anchorElement.classList.add('visible', 'modal');
  displayDisclosableData(disclosableData, anchorElement);
}
