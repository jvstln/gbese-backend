import "dotenv/config";
import { Request, Response } from "express";
import { ethers } from "ethers";
import KYCVerifierABI from "../abi/KYCVerifier.json";
import GbeseTokenABI from "../abi/GbeseToken.json";
import { APIError } from "better-auth/api";
import { Web3Withdraw } from "../types/web3.type";
import Decimal from "decimal.js";
import { transactionService } from "../services/transaction.service";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import mongoose from "mongoose";

class Web3Controller {
  provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  kycAddr = process.env.KYC_CONTRACT_ADDRESS!;
  privateKey = process.env.PRIVATE_KEY!;
  signer = new ethers.Wallet(this.privateKey, this.provider);
  kycContract = new ethers.Contract(
    this.kycAddr,
    KYCVerifierABI.abi,
    this.signer
  );
  tokenContract = new ethers.Contract(
    process.env.GBESE_TOKEN_CONTRACT_ADDRESS!,
    GbeseTokenABI.abi,
    this.signer
  );

  async verifyKYC(req: Request, res: Response) {
    const { wallet } = req.body;
    if (!ethers.isAddress(wallet)) {
      throw new APIError("BAD_REQUEST", {
        message: "Invalid wallet address",
      });
    }

    try {
      const issuedAt = Math.floor(Date.now() / 1000);
      const domain = {
        name: "Gbese KYC",
        version: "1",
        chainId: 84532,
        verifyingContract: this.kycAddr,
      };

      const types = {
        KYC: [
          { name: "user", type: "address" },
          { name: "issuedAt", type: "uint256" },
        ],
      };

      const message = { user: wallet, issuedAt };

      const signature = await this.signer.signTypedData(domain, types, message);

      const tx = await this.kycContract.verifyKYC(wallet, issuedAt, signature);
      const receipt = await tx.wait();

      // Save  web3 KYC verification status to database
      req.userSession!.user.web3KycVerified = true;
      await req.userSession!.user.save();

      res.json({
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      });
    } catch (err: any) {
      console.error("KYC verification failed:", err);
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "KYC verification failed",
      });
    }
  }

  /**
   * Withdraw NGN balance into GBT and send to user's wallet
   * Body: { walletAddress: string; amountNGN: number; }
   */
  async withdrawToWallet(req: Request<{}, {}, Web3Withdraw>, res: Response) {
    try {
      const { walletAddress, amountNGN, description } = req.body;

      const dbTransaction = await mongoose.connection.transaction(async () => {
        // Retrieve user account from auth middleware
        const account = req.userSession!.account;

        // Check and validate off‐chain NGN balance
        const balanceNGN = account.balance;
        if (new Decimal(balanceNGN.toString()).lt(amountNGN)) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "Insufficient NGN balance",
          });
        }

        // Compute GBT amount at ₦1,600 = 1 GBT
        const gbtAmount = ethers.parseUnits(
          new Decimal(amountNGN).div(1600).toFixed(18), // as string
          18
        );

        // Mint GBT to user’s wallet
        const tx = await this.tokenContract.mint(walletAddress, gbtAmount);
        const receipt = await tx.wait();

        // Create transaction record
        const transaction = transactionService.declare({
          accountId: account._id,
          amount: amountNGN,
          type: TransactionTypes.DEBIT,
          category: TransactionCategories.WEB3_WITHDRAWAL,
          balanceBefore: account.balance,
          metadata: {
            gbtAmount,
            walletAddress,
            receipt,
          },
          description,
        });

        // Debit user's NGN balance off‐chain
        account.balance = new Decimal(account.balance.toString())
          .sub(amountNGN)
          .toString();
        await account.save();

        // Save transaction record
        transaction.balanceAfter = account.balance;
        transaction.status = TransactionStatuses.SUCCESS;
        await transaction.save();

        return {
          transaction,
          receipt,
          gbtAmount,
        };
      });

      res.json({
        success: true,
        message: "Withdrawal to wallet successful",
        data: dbTransaction,
      });
    } catch (err: any) {
      console.error("Withdraw to wallet failed:", err);
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Withdraw to wallet failed",
      });
    }
  }
}

export const web3Controller = new Web3Controller();
