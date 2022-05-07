import useSWR from 'swr';
import { normalizeOwnedCollection } from '../../../../utils/normalize';
import { createCollectionHash } from '../../../../utils/hash';

export const handler = (web3, contract) => (collections, account) => {
  const swrRes = useSWR(
    () => (web3 && contract && account ? `web3/ownedCollections/${account}` : null),
    async () => {
      const ownedCollections = [];

      for (let i = 0; i < collections.length; i += 1) {
        const collection = collections[i];

        if (!collection._id) {
          continue;
        }

        const collectionHash = createCollectionHash(web3)(collection._id, account);
        const ownedCollection = await contract.methods.getCollectionByHash(collectionHash).call();

        if (ownedCollection.owner !== '0x0000000000000000000000000000000000000000') {
          const normalized = normalizeOwnedCollection(web3)(collection, ownedCollection);
          ownedCollections.push(normalized);
        }
      }

      return ownedCollections;
    }
  );

  return {
    ...swrRes,
    lookup:
      swrRes.data?.reduce((a, c) => {
        a[c._id] = c;
        return a;
      }, {}) ?? {},
  };
};
