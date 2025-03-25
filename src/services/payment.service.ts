import { Request } from "express"
import response from "../utils/response"
import Payment from "../models/payment"
import { CreatePaymentDTO } from "../dtos/payment.dto"
import User from "../models/user"
import { SuccessMessage } from "../utils/constant"

const fncCreatePayment = async (req: Request) => {
  try {
    const { ID } = req.user
    await Payment.create({
      ...req.body as CreatePaymentDTO,
      Customer: ID
    })
    return response({}, false, "Thanh toán thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListPayment = async () => {
  try {
    const payments = await Payment
      .find()
      .populate("Customer", ["_id", "FullName"])
    return response(payments, false, SuccessMessage.GET_DATA_SUCCESS, 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListPaymentByUser = async (req: Request) => {
  try {
    const { ID } = req.user
    const payments = await Payment.find({
      Customer: ID
    })
    return response(payments, false, "Thanh toán thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const PaymentService = {
  fncCreatePayment,
  fncGetListPayment,
  fncGetListPaymentByUser
}

export default PaymentService
