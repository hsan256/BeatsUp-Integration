import { useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
  '0xb1dcbe374905b03dcff1242ddf21f1c40db5a3affc1a7a47df4bf7b5075dcc00': true,
  '0xda8349d6297fda36751786eed6c287082491e3e5a35996027206bd823a41e1ab': true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? 'web3/accounts' : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error('Cannot retrieve an account. Please refresh the browser.');
      }

      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on('accountsChanged', mutator);

    return () => {
      provider?.removeListener('accountsChanged', mutator);
    };
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
