import useSWR from "swr"
import { normalizeOwnedCollection } from '../../../../utils/normalize';
import { createCollectionHash } from "../../../../utils/hash";

export const handler = (web3, contract) => (collection, account) => {
  const swrRes = useSWR(() =>
    (web3 && contract && account) ? `web3/ownedCollection/${account}` : null,
    async () => {
      
      const collectionHash = createCollectionHash(web3)(collection._id, account);
      const ownedCollection = await contract.methods.getCollectionByHash(collectionHash).call()

      if (ownedCollection.owner === "0x0000000000000000000000000000000000000000") {
        return null
      }

      return normalizeOwnedCollection(web3)(collection, ownedCollection)
    }
  )

  return swrRes
}