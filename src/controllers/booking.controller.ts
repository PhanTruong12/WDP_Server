import { Request, Response } from "express"
import BookingService from "../services/booking.service"

const createBooking = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncCreateBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListMyBooking = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncGetListMyBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const changeBookingStatus = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncChangeBookingStatus(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const changeBookingPaidStatus = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncChangeBookingPaidStatus(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getDetailBooking = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncGetDetailBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const updateBooking = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncUpdateBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getBookingScheduleOfBarber = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncGetBookingScheduleOfBarber(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const BookingController = {
  createBooking,
  getListMyBooking,
  changeBookingStatus,
  changeBookingPaidStatus,
  getDetailBooking,
  updateBooking,
  getBookingScheduleOfBarber
}

export default BookingController