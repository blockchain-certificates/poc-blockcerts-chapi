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

function displayDisclosableData (data: DisclosableData[]) {
  const anchor = document.getElementsByClassName('js-selective-disclosure')[0];
  const list = document.createElement('ul');
  data.forEach(entry => {
    const listItem = document.createElement('li');
    const label = document.createElement('label');
    label.innerText = entry.value;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = entry.key;
    checkbox.id = entry.key;
    label.htmlFor = entry.key;
    label.appendChild(checkbox);
    listItem.appendChild(label);
    list.appendChild(listItem);
  });
  anchor.appendChild(list);
  anchor.classList.remove('hidden');
  anchor.classList.add('visible');
}

export default async function selectivelyDiscloseData (certificate) {
  console.log(certificate);
  const disclosableData = getDisclosableData(certificate.credentialSubject);
  displayDisclosableData(disclosableData);
}
