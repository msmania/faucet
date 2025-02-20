import { ethers, parseEther } from "ethers";
import { LRUCache } from 'lru-cache';

const Signers = [
  new ethers.Wallet(process.env.SIGNER1_KEY),
  new ethers.Wallet(process.env.SIGNER2_KEY),
  new ethers.Wallet(process.env.SIGNER3_KEY),
  new ethers.Wallet(process.env.SIGNER4_KEY),
];

const WalletCache = new LRUCache({
  max: 1000 * process.env.COOLDOWN_IN_SEC,
  ttl: 1000 * process.env.COOLDOWN_IN_SEC,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
})

function normalizeWallet(wallet) {
  if (typeof(wallet) != "string") {
    throw new Error("invalid input");
  }
  if (wallet.startsWith("0x")) {
    wallet = wallet.substring(2);
  }
  if (wallet.length == 0) {
    throw new Error("invalid input");
  }
  wallet = wallet.toLowerCase();
  return wallet;
}

async function getToken({sendTo, network}) {
  const endpoint = network == 'dev2'
  ? process.env.ENDPOINT_DEV2
  : process.env.ENDPOINT;
  const normalized = normalizeWallet(sendTo);
  if (WalletCache.get(normalized)) {
    throw new Error(
      `This wallet is cooling down (= ${process.env.COOLDOWN_IN_SEC} sec)`
    );
  }

  const provider = new ethers.JsonRpcProvider(endpoint);
  const gas = await provider.send("eth_gasPrice", []);
  const r = Math.floor(Math.random() * Signers.length)
  const signer = Signers[r].connect(provider);
  const tx = {
    from: signer.address,
    to: sendTo,
    value: parseEther(process.env.AMOUNT),
    gasPrice: gas,
  };
  const txResult = await signer.sendTransaction(tx);
  await txResult.wait();

  WalletCache.set(normalized, 1);

  return txResult.hash;
}

export async function POST(req) {
  const searchParams = req.nextUrl.searchParams;
  const network = searchParams.get('network');

  try {
    const args = await req.json();

    let ret = null;
    switch (args[0]) {
    case 'send':
      ret = await getToken({sendTo: args[1], network});
      break;
    case 'amount':
      ret = process.env.AMOUNT;
      break;
    }

    return Response.json(ret);
  }
  catch (e) {
    return Response.json({message: e.message});
  }
}
