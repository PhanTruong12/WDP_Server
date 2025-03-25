import { Request, Response } from "express"
import PaymentService from "../services/payment.service"

const createPayment = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncCreatePayment(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListPayment = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncGetListPayment()
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListPaymentByUser = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncGetListPaymentByUser(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const PaymentController = {
  createPayment,
  getListPayment,
  getListPaymentByUser
}

export default PaymentController
