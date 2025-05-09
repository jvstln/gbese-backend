import { Request, Response } from "express";
import { debtRequestService } from "../services/debtRequest.service";
import {
  DebtRequestFilters,
  DebtRequestUserRoles,
} from "../types/debtRequest.type";

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
    req: Request<{}, {}, {}, DebtRequestFilters>,
    res: Response
  ) {
    const { role, status } = req.query;
    const userId = req.userSession!.user._id;
    let filter: Record<string, unknown> = {};

    if (role === DebtRequestUserRoles.CREDITOR) filter.creditorId = userId;
    else if (role === DebtRequestUserRoles.DEBTOR) filter.debtorId = userId;
    else if (role === DebtRequestUserRoles.PAYER) filter.payerId = userId;
    else {
      filter = {
        $or: [
          { debtorId: userId },
          { creditorId: userId },
          { payerId: userId },
        ],
      };
    }

    if (status) filter.status = status;

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

    const payedDebtRequest = await debtRequestService.payDebtRequest(
      debtRequestId,
      req.userSession!.user
    );

    res.status(200).json({
      success: true,
      message: "Debt request paid successfully",
      data: payedDebtRequest,
    });
  }
}

export const debtRequestController = new DebtRequestController();
