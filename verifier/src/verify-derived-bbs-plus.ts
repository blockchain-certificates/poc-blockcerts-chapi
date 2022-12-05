export default async function verifyDerivedBBSPlus (signedDocument) {
  const { verificationStatus } = await fetch('http://localhost:4666/verify-derived', {
    method: 'POST',
    body: JSON.stringify({
      signedDocument
    })
  }).then(res => res.json());
  console.log(verificationStatus);
}
