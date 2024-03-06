'use client';

import { useCallback, useEffect, useState } from "react";
import SpinnerButton from "./components/button";
import NetworkResult from "./components/networkResult";
import { FetchJson, IsErrorResponse } from "./utils";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState({});

  useEffect(() => {
    async function useEffectAsync() {
      const amountNew = await FetchJson('/api', ['amount']);
      setAmount(parseInt(amountNew));
    }

    const maybeWallet = searchParams.get('wallet');
    if (maybeWallet) {
      setWallet(maybeWallet);
    }

    useEffectAsync();
  }, []);

  const onChange = useCallback(event => setWallet(event.target.value), []);

  const onClick = useCallback(async event => {
    setPending(true);
    event.preventDefault();
    try {
      const txHash = await FetchJson('/api', ['send', wallet]);
      if (IsErrorResponse(txHash)) {
        const err = new Error();
        err.message = txHash.message;
        throw err;
      }
      setWallet('');
      setResult({message: txHash});
    }
    catch (e) {
      setResult({error: e.message});
    }
    finally {
      setPending(false);
    }
  }, [wallet]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="font-bold text-5xl mb-6">The Faucet</h1>

      <div className="mb-4 w-2/3">
        <label htmlFor="network-name"
          className="block text-gray-700 text-sm font-bold mb-2">
          Enter your wallet address:
        </label>
        <input type="input" id="network-name"
          value={wallet}
          spellCheck="false"
          className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={onChange} />
      </div>
      <div className="flex flex-row justify-center mb-2">
        <SpinnerButton
          type="button"
          className={amount ? "" : "hidden"}
          label={`Get ${amount} Token`}
          labelPending="Requesting..."
          isPending={pending}
          onClick={onClick}
          />
      </div>
      <NetworkResult result={result} />
    </main>
  )
}
