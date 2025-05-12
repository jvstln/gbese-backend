import { transferRecipientModel } from "../model/transferRecipient.model";
import { CreateTransferRecipient } from "../types/paystack.type";
import { TransferRecipient } from "../types/transferRecipient.type";
import { paystackService } from "./paystack.service";

export class TransferRecipientService {
  async resolveTransferRecipient(
    data: CreateTransferRecipient & { userId: string }
  ) {
    const transferRecipientData = await paystackService.createTransferRecipient(
      data
    );

    let transferRecipient = await transferRecipientModel.findOne({
      userId: data.userId,
      recipientCode: transferRecipientData.recipient_code,
    });

    if (!transferRecipient) {
      transferRecipient = new transferRecipientModel({
        userId: data.userId,
        recipientCode: transferRecipientData.recipient_code,
      });
      await transferRecipient.save();
    }

    return {
      user: (await transferRecipient.populate("user")).user,
      ...transferRecipientData,
    };
  }
}

export const transferRecipientService = new TransferRecipientService();
