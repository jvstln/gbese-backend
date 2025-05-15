import 'dotenv/config';
import { Request, Response } from 'express';
import { ethers } from 'ethers';
import GbeseTokenABI from '../abi/GbeseToken.json';
import { accountService } from '../services/account.service'; // your off‐chain balance logic

// Setting up ethers provider & signer for our GbeseToken contract
const provider    = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
const signer      = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const tokenContract = new ethers.Contract(
  process.env.GBESE_TOKEN_CONTRACT_ADDRESS!,
  GbeseTokenABI.abi,
  signer
);

export const withdrawController = {
  /**
   * Withdraw NGN balance into GBT and send to user's wallet
   * POST /api/withdraw
   * Body: { walletAddress: string; amountNGN: number; }
   */
  async withdrawToWallet(req: Request, res: Response) {
    try {
    //   const userId = req.user.id; // assuming authMiddleware sets req.user
      const { walletAddress, amountNGN } = req.body as {
        walletAddress: string;
        amountNGN: number;
      };

      // 1) Check off‐chain NGN balance
    //   const balanceNGN = await accountService.getBalance(userId);
    //   if (amountNGN > balanceNGN) {
    //     return res.status(400).json({ error: 'Insufficient NGN balance' });
    //   }

      // 2) Compute GBT amount at ₦1,600 = 1 GBT
      const gbtAmount = ethers.parseUnits(
        (amountNGN / 1600).toFixed(18), // as string
        18
      );

      // 3) Mint GBT to user’s wallet
      const tx = await tokenContract.mint(walletAddress, gbtAmount);
      const receipt = await tx.wait();

      // 4) Debit user's NGN balance off‐chain
    //   await accountService.debit(userId, amountNGN);

      return res.json({
        success: true,
        txHash: receipt.transactionHash,
        gbtAmount: ethers.formatUnits(gbtAmount, 18),
      });
    } catch (err: any) {
      console.error('Withdraw to wallet failed:', err);
      return res.status(500).json({ error: err.message });
    }
  },
};
