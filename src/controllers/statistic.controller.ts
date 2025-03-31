import { Request, Response } from 'express'
import StatisticService from '../services/statistic.service'

const statisticTotalBookingByBarber = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTotalBookingByBarber(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const statisticServiceBooking = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticServiceBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const statisticTotalBooking = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTotalBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const statisticTotalAccount = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTotalAccount(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const StatisticController = {
  statisticTotalBookingByBarber,
  statisticServiceBooking,
  statisticTotalBooking,
  statisticTotalAccount
}

export default StatisticController
