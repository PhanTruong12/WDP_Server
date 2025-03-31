import { Request, Response } from "express"
import FeedbackSerivce from "../services/feedback.service"

const createFeedback = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncCreateFeedback(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListFeedbackOfBarber = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncGetListFeedbackOfBarber(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const deletedFeedback = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncDeleteFeedback(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListFeedback = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncGetListFeedback(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const FeedbackController = {
  createFeedback,
  getListFeedbackOfBarber,
  deletedFeedback,
  getListFeedback
}

export default FeedbackController