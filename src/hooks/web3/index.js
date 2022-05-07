import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useHooks, useWeb3 } from '../../contexts/providers/web3';

const _isEmpty = (data) => {
  return (
    data == null ||
    data === '' ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};

const enhanceHook = (swrRes) => {
  const { data, error } = swrRes;
  const hasInitialResponse = !!(data || error);
  const isEmpty = hasInitialResponse && _isEmpty(data);

  return {
    ...swrRes,
    isEmpty,
    hasInitialResponse,
  };
};

export const useNetwork = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: swrRes,
  };
};

export const useAccount = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useAccount)());
  return {
    account: swrRes,
  };
};

export const useAdmin = () => {
  const { account } = useAccount();
  const { requireInstall } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireInstall || (account.hasInitialResponse && !account.isAdmin) || account.isEmpty) {
      // navigate(redirectTo);
    }
  }, [account]);

  return { account };
};

export const useOwnedCollections = (...args) => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useOwnedCollections)(...args));

  return {
    ownedCollections: swrRes,
  };
};

export const useOwnedCollection = (...args) => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useOwnedCollection)(...args));

  return {
    ownedCollection: swrRes,
  };
};

export const useManagedCollections = (...args) => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useManagedCollections)(...args));

  return {
    managedCollections: swrRes,
  };
};

export const useWalletInfo = () => {
  const { account } = useAccount();
  const { network } = useNetwork();

  const isConnecting =
   !account.hasInitialResponse &&
   !network.hasInitialResponse

  return {
    account,
    network,
    isConnecting,
    hasConnectedWallet: !!(account.data && network.isSupported)
  };
};
