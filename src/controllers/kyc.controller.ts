import 'dotenv/config';
import { Request, Response } from 'express';
import { ethers } from 'ethers';
import KYCVerifierABI from  "../abi/KYCVerifier.json"; 

const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
const kycAddr   = process.env.KYC_CONTRACT_ADDRESS!;
const privateKey = process.env.PRIVATE_KEY!;
const signer   = new ethers.Wallet(privateKey, provider);
const kycContract = new ethers.Contract(kycAddr, KYCVerifierABI.abi, signer);

export async function verifyKYC(req: Request, res: Response) {
  const { wallet } = req.body;
  if (!ethers.isAddress(wallet)) {
    return res.status(400).json({ success: false, error: 'Invalid wallet address' });
  }

  try {
    const issuedAt = Math.floor(Date.now() / 1000);
    
    const domain = {
        name: 'KYCVerifier',         
        version: '1',
        chainId: 84532,              
        verifyingContract: kycAddr
        };

        const types = {
        KYCVerification: [
            { name: 'wallet', type: 'address' }
        ]
    };

    const value = {
    wallet: '0xWalletAddressToVerify'
    };

    const signature = await signer.signTypedData(domain, types, value);

    const tx = await kycContract.verifyKYC(wallet, issuedAt, signature);
    const receipt = await tx.wait();

    return res.json({
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err: any) {
    console.error('KYC verification failed:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}