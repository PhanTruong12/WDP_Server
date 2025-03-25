import { ObjectId } from "mongoose"

export interface CreatePaymentDTO {
  Booking: ObjectId,
  TotalFee: number,
  Description: string,
  Percent: number
}