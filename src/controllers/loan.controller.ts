import { Request, Response } from "express";
import { loanService } from "../services/loan.service";
import { BorrowLoan, PayLoanUsingIds } from "../types/loan.type";
import mongoose from "mongoose";

class LoanController {
  async borrowLoan(
    req: Request<{}, {}, Omit<BorrowLoan, "accountId">>,
    res: Response
  ) {
    const borrowedLoanData = await loanService.borrowLoan({
      accountId: req.userSession!.user.account._id,
      ...req.body,
    });

    res.json({
      success: true,
      message: "Loan borrowed successfully",
      data: borrowedLoanData,
    });
  }

  async getUserLoans(req: Request, res: Response) {
    const userLoans = await loanService.getLoans({
      accountId: req.userSession!.user.account._id.toString(),
    });

    res.json({
      success: true,
      message: "User loans retrieved successfully",
      data: userLoans,
    });
  }

  async payLoan(
    req: Request<
      { loanId: string },
      {},
      Omit<PayLoanUsingIds, "loanId" | "accountId">
    >,
    res: Response
  ) {
    const loanPayment = await loanService.payLoanUsingIds({
      loanId: new mongoose.Types.ObjectId(req.params.loanId),
      accountId: req.userSession!.user.account._id,
      ...req.body,
    });

    res.json({
      success: true,
      message: "Loan paid successfully",
      data: loanPayment,
    });
  }
}

export const loanController = new LoanController();
