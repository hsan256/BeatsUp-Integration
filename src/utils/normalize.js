export const COLLECTION_STATES = {
  0: 'purchased',
  1: 'activated',
  2: 'deactivated',
};

export const normalizeOwnedCollection = (web3) => (collection, ownedCollection) => {
  return {
    ...collection,
    ownedCollectionId: ownedCollection.id,
    proof: ownedCollection.proof,
    owned: ownedCollection.owner,
    price: web3.utils.fromWei(ownedCollection.price),
    state: COLLECTION_STATES[ownedCollection.state],
  };
};
