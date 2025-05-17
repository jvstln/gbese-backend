import { Request, Response } from "express";
import { loanService } from "../services/loan.service";
import { BorrowLoan, PayLoan } from "../types/loan.type";

class LoanController {
  async borrowLoan(
    req: Request<{}, {}, Omit<BorrowLoan, "accountId">>,
    res: Response
  ) {
    const borrowedLoanData = await loanService.borrowLoan({
      accountId: req.userSession!.user.account._id.toString(),
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
    req: Request<{ loanId: string }, {}, Omit<PayLoan, "loanId" | "accountId">>,
    res: Response
  ) {
    const loanPayment = await loanService.payLoan({
      loanId: req.params.loanId,
      accountId: req.userSession!.user.account._id.toString(),
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
