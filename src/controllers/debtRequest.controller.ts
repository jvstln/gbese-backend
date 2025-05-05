import { Request, Response } from "express";
import { debtRequestUserRoles } from "../types/debtRequest.type";
import { debtRequestService } from "../services/debtRequest.service";

class DebtRequestController {
  async createDebtRequest(req: Request, res: Response) {
    req.body.debtorId = req.userSession!.user._id;

    const debtTransfer = await debtRequestService.createDebtRequest(req.body);

    res.status(201).json({
      success: true,
      message: "Debt request created successfully",
      data: debtTransfer,
    });
  }

  async getUserDebtRequests(
    req: Request<{}, {}, {}, { role: (typeof debtRequestUserRoles)[number] }>,
    res: Response
  ) {
    const { role } = req.query;
    const userId = req.userSession!.user._id;
    let filter: Record<string, unknown> = {};

    if (role === "creditor") filter.creditorId = userId;
    else if (role === "debtor") filter.debtorId = userId;
    else if (role === "payer") filter.payerId = userId;
    else {
      filter = {
        $or: [
          { debtorId: userId },
          { creditorId: userId },
          { payerId: userId },
        ],
      };
    }

    const userDebtRequests = await debtRequestService.getDebtRequests(filter);
    res.status(200).json({
      success: true,
      message: "User debt requests fetched successfully",
      data: userDebtRequests,
    });
  }

  async getAllDebtRequests(_req: Request, res: Response) {
    const debtTransfers = await debtRequestService.getDebtRequests();
    res.status(200).json({
      success: true,
      message: "All debt requests fetched successfully",
      data: debtTransfers,
    });
  }

  async updateDebtRequest(req: Request, res: Response) {
    const { debtRequestId } = req.params;
    const updates = req.body;

    const updatedDebtTransfer = await debtRequestService.updateDebtRequest(
      debtRequestId,
      updates
    );
    res.status(200).json({
      success: true,
      message: "Debt request updated successfully",
      data: updatedDebtTransfer,
    });
  }

  async payDebtRequest(req: Request, res: Response) {
    const { debtRequestId } = req.params;
    const updates = req.body;

    const updatedDebtTransfer = await debtRequestService.updateDebtRequest(
      debtRequestId,
      updates
    );
    res.status(200).json({
      success: true,
      message: "Debt request paid successfully",
      data: updatedDebtTransfer,
    });
  }
}

export const debtRequestController = new DebtRequestController();
