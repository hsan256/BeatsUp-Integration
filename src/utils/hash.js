export const createCollectionHash = (web3) => (collectionId, account) => {
  const hexCollectionId = web3.utils.utf8ToHex(collectionId);
  const collectionHash = web3.utils.soliditySha3(
    { type: 'bytes32', value: hexCollectionId },
    { type: 'address', value: account }
  );

  return collectionHash;
};
