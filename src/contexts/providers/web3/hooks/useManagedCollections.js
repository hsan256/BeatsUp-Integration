import useSWR from 'swr';
import { normalizeOwnedCollection } from '../../../../utils/normalize';

export const handler = (web3, contract) => (account) => {
  const swrRes = useSWR(
    web3 && contract && account.data && account.isAdmin ? `web3/managedCollections/${account.data}` : null,
    async () => {
      const collections = [];
      const collectionCount = await contract.methods.getCollectionCount().call();

      for (let i = Number(collectionCount) - 1; i >= 0; i -= 1) {
        const collectionHash = await contract.methods.getCollectionHashAtIndex(i).call();
        const collection = await contract.methods.getCollectionByHash(collectionHash).call();

        if (collection) {
          const normalized = normalizeOwnedCollection(web3)({ hash: collectionHash }, collection);
          collections.push(normalized);
        }
      }

      return collections;
    }
  );

  return swrRes;
};
