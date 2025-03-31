import { Request } from 'express'
import response from "../utils/response"
import Booking from '../models/booking'
import { BOOKING_STATUS, Roles, SUCCESS_MESSAGE } from '../utils/constant'
import mongoose from 'mongoose'
import { PaginationDTO } from '../dtos/common.dto'
import User from '../models/user'

const fncStatisticTotalBookingByBarber = async (req: Request) => {
  try {
    const { ID } = req.user
    const totalBooking = Booking.countDocuments({
      Barber: ID
    })
    const totalComplete = Booking.countDocuments({
      Barber: ID,
      BookingStatus: BOOKING_STATUS.DA_HOAN_THANH
    })
    const totalCancel = Booking.countDocuments({
      Barber: ID,
      BookingStatus: BOOKING_STATUS.HUY_XAC_NHAN
    })
    const result = await Promise.all([totalBooking, totalComplete, totalCancel])
    return response(
      {
        TotalBooking: result[0],
        TotalComplete: result[1],
        TotalCancel: result[2]
      },
      false,
      SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticServiceBooking = async (req: Request) => {
  try {
    const { CurrentPage, PageSize } = req.body as PaginationDTO
    const { ID } = req.user
    const services = Booking.aggregate([
      {
        $match: {
          Barber: new mongoose.Types.ObjectId(`${ID}`)
        }
      },
      {
        $unwind: "$Services"
      },
      {
        $project: {
          _id: "$Services._id",
          ServiceName: "$Services.ServiceName",
          ServicePrice: "$Services.ServicePrice",
          ExpensePrice: "$Services.ExpensePrice",
          ServiceTime: "$Services.ServiceTime",
          BookingID: "$_id",
          createdAt: "$createdAt"
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize },
    ])
    const total = Booking.aggregate([
      {
        $match: {
          Barber: new mongoose.Types.ObjectId(`${ID}`)
        }
      },
      {
        $unwind: "$Services"
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([services, total])
    return response(
      {
        List: result[0],
        Total: !!result[1].length ? result[1][0].total : 0,
      },
      false,
      SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticTotalBooking = async (req: Request) => {
  try {
    const currentDate = new Date()
    const totalBooking = Booking.countDocuments()
    const totalComplete = Booking.countDocuments({
      BookingStatus: BOOKING_STATUS.DA_HOAN_THANH
    })
    const totalCancel = Booking.countDocuments({
      BookingStatus: BOOKING_STATUS.HUY_XAC_NHAN
    })
    let totalBookingByMonth = [] as any[]
    for (let i = 1; i <= 12; i++) {
      const totalBooking = Booking.countDocuments({
        createdAt: {
          $gte: new Date(`${currentDate.getFullYear()}-${i}-01`),
          $lt: new Date(`
            ${i === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${i === 12 ? 1 : i + 1}-
            01`
          )
        }
      })
      totalBookingByMonth.push(totalBooking)
    }
    const result = await Promise.all([totalBooking, totalComplete, totalCancel])
    const resultTotalBookingByMonth = await Promise.all(totalBookingByMonth)
    const dataTotalBookingByMonth = resultTotalBookingByMonth.map((i: any, idx: number) => ({
      Month: `Tháng ${idx + 1}`,
      Total: i
    }))
    return response(
      {
        TotalBooking: result[0],
        TotalComplete: result[1],
        TotalCancel: result[2],
        TotalBookingByMonth: dataTotalBookingByMonth
      },
      false,
      SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticTotalAccount = async (req: Request) => {
  try {
    const totalAccount = User.countDocuments({
      RoleID: {
        $ne: Roles.ROLE_ADMIN
      }
    })
    const totalBarber = User.countDocuments({
      RoleID: Roles.ROLE_BARBER
    })
    const totalUser = User.countDocuments({
      RoleID: Roles.ROLE_USER
    })
    const result = await Promise.all([totalAccount, totalBarber, totalUser])
    return response(
      {
        TotalAccount: result[0],
        TotalBarber: result[1],
        TotalUser: result[2]
      },
      false,
      SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const StatisticService = {
  fncStatisticTotalBookingByBarber,
  fncStatisticServiceBooking,
  fncStatisticTotalBooking,
  fncStatisticTotalAccount
}

export default StatisticService