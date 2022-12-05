export interface VerificationStatus {
  verified: boolean;
  results: Array<{
    proof: any; // TODO: define a VC proof
    verified: boolean;
  }>
}

export default async function verifyDerivedBBSPlus (signedDocument): Promise<VerificationStatus> {
  const { verificationStatus } = await fetch('http://localhost:4666/verify-derived', {
    method: 'POST',
    body: JSON.stringify({
      signedDocument
    })
  }).then(res => res.json());

  return verificationStatus;
}
