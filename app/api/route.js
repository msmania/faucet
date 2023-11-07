import { ethers, parseEther } from "ethers";

const Provider = new ethers.JsonRpcProvider(process.env.ENDPOINT);
const Signers = [
  new ethers.Wallet(process.env.SIGNER1_KEY, Provider),
  new ethers.Wallet(process.env.SIGNER2_KEY, Provider),
  new ethers.Wallet(process.env.SIGNER3_KEY, Provider),
  new ethers.Wallet(process.env.SIGNER4_KEY, Provider),
];

async function getToken(sendTo) {
  const gas = await Provider.send("eth_gasPrice", []);

  const r = Math.floor(Math.random() * Signers.length)
  const tx = {
    from: Signers[r].address,
    to: sendTo,
    value: parseEther('1'),
    gasPrice: gas,
  };
  const txResult = await Signers[r].sendTransaction(tx);
  await txResult.wait();

  return txResult.hash;
}

export async function POST(req) {
  try {
    const args = await req.json();

    let ret = null;
    switch (args[0]) {
    case 'send':
      ret = await getToken(args[1]);
      break;
    }

    return Response.json(ret);
  }
  catch (e) {
    return Response.json({message: e.message});
  }
}
