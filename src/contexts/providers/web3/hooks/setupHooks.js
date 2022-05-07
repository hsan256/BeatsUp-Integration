import { handler as createAccountHook } from "./useAccount"
import { handler as createNetworkHook } from "./useNetwork"
import { handler as createOwnedCollectionsHook } from "./useOwnedCollections"
import { handler as createOwnedCollectionHook } from "./useOwnedCollection"
import { handler as createManagedCollectionsHook } from "./useManagedCollections"

export const setupHooks = ({web3, provider, contract}) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3),
    useOwnedCollections: createOwnedCollectionsHook(web3, contract),
    useOwnedCollection: createOwnedCollectionHook(web3, contract),
    useManagedCollections: createManagedCollectionsHook(web3, contract),
  }
}