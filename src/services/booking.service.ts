import { Request } from "express"
import response from "../utils/response"
import Booking from "../models/booking"
import {
  ChangeBookingPaidStatusDTO,
  ChangeBookingStatusDTO,
  CreateUpdateBookingDTO
} from "../dtos/booking.dto"
import { BOOKING_STATUS, ERROR_MESSAGE, Roles, SUCCESS_MESSAGE } from "../utils/constant"
import User from "../models/user"
import mongoose from "mongoose"
import sendEmail from "../utils/send-mail"
import { getOneDocument } from "../utils/queryFunction"
import moment from "moment"
import Payment from "../models/payment"

const fncCreateBooking = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { BarberID, BarberEmail, BarberName } = req.body as CreateUpdateBookingDTO
    const subject = "THÔNG BÁO KHÁCH HÀNG BOOKING"
    const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333;
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO KHÁCH HÀNG BOOKING</p>
                  <p style="margin-bottom:10px">Xin chào ${BarberName},</p>
                  <p>Bạn vừa có một khách hàng đặt lịch sử dụng dịch vụ của bạn. Hãy vào lịch sử booking của mình để kiểm tra thông tin booking.</p>
                  <div>
                    <span style="color:red; margin-right: 4px">Lưu ý:</span>
                    <span>Trong vòng 48h nếu bạn không xác nhận booking này thì booking này sẽ tự động chuyển thành "Hủy xác nhận".</span>
                  </div>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(BarberEmail, subject, content)
    if (!checkSendMail) return response({}, true, ERROR_MESSAGE.SEND_MAIL_ERROR, 200)
    await Booking.create({
      ...req.body,
      Barber: BarberID,
      Customer: UserID
    })
    return response({}, false, "Bạn đã booking thành công. Chờ phản hồi từ barber", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListMyBooking = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const query = {
      [
        RoleID === Roles.ROLE_BARBER
          ? "Barber"
          : "Customer"
      ]: new mongoose.Types.ObjectId(`${ID}`)
    }
    const bookings = await Booking.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Customer",
          foreignField: "_id",
          as: "Customer",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account"
              }
            },
            { $unwind: '$Account' },
            {
              $addFields: {
                Email: "$Account.Email"
              }
            },
            {
              $project: {
                FullName: 1,
                AvatarPath: 1,
                Email: 1,
                Services: 1
              }
            }
          ]
        }
      },
      { $unwind: '$Customer' },
      {
        $lookup: {
          from: "users",
          localField: "Barber",
          foreignField: "_id",
          as: "Barber",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account"
              }
            },
            { $unwind: '$Account' },
            {
              $addFields: {
                Email: "$Account.Email"
              }
            },
            {
              $project: {
                FullName: 1,
                AvatarPath: 1,
                Email: 1,
                Services: 1,
                Schedules: 1
              }
            }
          ]
        }
      },
      { $unwind: '$Barber' },
      {
        $sort: {
          updatedAt: -1
        }
      },
      {
        $project: {
          _id: 1,
          Barber: 1,
          Customer: 1,
          DateAt: 1,
          BookingStatus: 1,
          Services: 1,
          CustomerAddress: 1,
          CustomerPhone: 1,
          createdAt: 1
        }
      }
    ])
    const data = bookings.map((i: any) => ({
      ...i,
      IsBookAgain: RoleID === Roles.ROLE_USER && i.BookingStatus === BOOKING_STATUS.HUY_XAC_NHAN ? true : false
    }))
    return response(data, false, SUCCESS_MESSAGE.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeBookingStatus = async (req: Request) => {
  try {
    const { BookingID, BookingStatus, CustomerEmail, CustomerName, BarberEmail, BarberName, Reason } = req.body as ChangeBookingStatusDTO
    const { RoleID } = req.user
    const booking = await getOneDocument(Booking, "_id", BookingID)
    if (!booking) return response({}, true, ERROR_MESSAGE.BOOKING_NOT_EXIST, 200)
    let subject = "THÔNG BÁO TRẠNG THÁI BOOKING", confirmContent, rejectContent, content = "", checkSendMail
    if ([BOOKING_STATUS.DA_XAC_NHAN, BOOKING_STATUS.HUY_XAC_NHAN].includes(BookingStatus)) {
      if (RoleID === Roles.ROLE_BARBER) {
        confirmContent = `Barber ${BarberName} đã xác nhận booking của bạn. Bạn hãy truy cập vào lịch sử booking của mình để tiến hành thanh toán và hoàn tất booking.`
        rejectContent = `Barber ${BarberName} đã hủy xác nhận booking của bạn với lý do: ${Reason}`
        content = `
        <html>
        <head>
        <style>
            p {
                color: #333;
            }
        </style>
        </head>
        <body>
          <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">${subject}</p>
          <p style="margin-bottom:10px">Xin chào ${CustomerName},</p>
          <p style="margin-bottom:10px">${BookingStatus === BOOKING_STATUS.DA_XAC_NHAN ? confirmContent : rejectContent}</p>
          ${BookingStatus === BOOKING_STATUS.DA_XAC_NHAN ?
            `<div>
            <span style="color:red; margin-right: 4px">Lưu ý:</span>
            <span>Trong vòng 48h nếu bạn không thanh toán booking này thì booking này sẽ tự động chuyển thành "Hủy xác nhận".</span>
          </div>`
            : ""
          }
        </body>
        </html>
        `
        checkSendMail = await sendEmail(CustomerEmail as string, subject, content)
      } else {
        rejectContent = `Khách hàng ${CustomerName} đã hủy booking với lý do: ${Reason}`
        content = `
        <html>
        <head>
        <style>
            p {
                color: #333;
            }
        </style>
        </head>
        <body>
          <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">${subject}</p>
          <p style="margin-bottom:10px">Xin chào ${BarberName},</p>
          <p style="margin-bottom:10px">${rejectContent}</p>
        </body>
        </html>
        `
        checkSendMail = await sendEmail(BarberEmail as string, subject, content)
      }
      if (!checkSendMail) return response({}, true, ERROR_MESSAGE.SEND_MAIL_ERROR, 200)
    }
    const updateBooking = await Booking
      .findOneAndUpdate(
        { _id: BookingID },
        { BookingStatus: BookingStatus },
        { new: true }
      )
      .populate("Customer", ["_id", "FullName", "AvatarPath"])
      .populate("Barber", ["_id", "FullName", "AvatarPath"])
      .lean()
    if (!updateBooking) return response({}, true, ERROR_MESSAGE.HAVE_AN_ERROR, 200)
    const data = {
      ...updateBooking,
      Customer: {
        ...updateBooking.Customer,
        Email: CustomerEmail
      },
      Barber: {
        ...updateBooking.Barber,
        Email: BarberEmail
      },
      IsBookAgain: RoleID === Roles.ROLE_BARBER && updateBooking.BookingStatus === BOOKING_STATUS.HUY_XAC_NHAN ? true : false,
      ButtonShow: {
        IsUpdate: RoleID === Roles.ROLE_USER ? false : true,
        IsConfirm: RoleID === Roles.ROLE_BARBER ? false : true,
        IsReject: true,
        IsPayment: RoleID === Roles.ROLE_USER ? false : true,
        IsComplete: RoleID === Roles.ROLE_USER ? true : false,
        IsFeedback: RoleID === Roles.ROLE_BARBER ? true : false,
      },
      ButtonDisabled: {
        IsUpdate: updateBooking.BookingStatus === BOOKING_STATUS.CHO_XAC_NHAN ? false : true,
        IsConfirm: updateBooking.BookingStatus === BOOKING_STATUS.CHO_XAC_NHAN ? false : true,
        IsReject: updateBooking.BookingStatus === BOOKING_STATUS.CHO_XAC_NHAN ? false : true,
        IsPayment: updateBooking.BookingStatus === BOOKING_STATUS.DA_XAC_NHAN && !updateBooking.IsPaid
          ? false
          : true,
        IsComplete: updateBooking.BookingStatus === BOOKING_STATUS.CHO_THUC_HIEN &&
          !!updateBooking.IsPaid && moment().isAfter(updateBooking.DateAt) ? true : false,
        IsFeedback: updateBooking.BookingStatus === BOOKING_STATUS.DA_HOAN_THANH ? false : true
      }
    }
    return response(
      data,
      false,
      BookingStatus === BOOKING_STATUS.DA_XAC_NHAN
        ? "Xác nhận thành công"
        : BookingStatus === BOOKING_STATUS.HUY_XAC_NHAN
          ? "Hủy thành công"
          : "Hoàn thành booking"
      ,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeBookingPaidStatus = async (req: Request) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { ID } = req.user
    const { BookingID, BarberName, BarberEmail, CustomerName } = req.body as ChangeBookingPaidStatusDTO
    const booking = await getOneDocument(Booking, "_id", BookingID)
    if (!booking) return response({}, true, ERROR_MESSAGE.BOOKING_NOT_EXIST, 200)
    const subject = "THÔNG BÁO KHÁCH HÀNG BOOKING"
    const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333;
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">${subject}</p>
                  <p style="margin-bottom:10px">Xin chào ${BarberName},</p>
                  <p style="margin-bottom:10px">Thông tin booking:</p>
                  <p>Tên khách hàng: ${CustomerName}</p>
                  <p>Thời gian học: ${moment(booking.DateAt).format("DD/MM/YYYY HH:mm")}</p>
                  <p>Bạn hãy vào lịch book của mình để kiểm tra thông tin booking.</p>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(BarberEmail, subject, content)
    if (!checkSendMail) return response({}, true, ERROR_MESSAGE.SEND_MAIL_ERROR, 200)
    const updateBooking = await Booking.findOneAndUpdate(
      { _id: BookingID },
      {
        IsPaid: true,
        BookingStatus: BOOKING_STATUS.CHO_THUC_HIEN
      },
      { session: session }
    )
    if (!updateBooking) {
      await session.abortTransaction()
      return response({}, true, ERROR_MESSAGE.HAVE_AN_ERROR, 200)
    }
    await Payment.create(
      [{
        ...req.body as ChangeBookingPaidStatusDTO,
        Booking: BookingID,
        Customer: ID
      }],
      { session: session }
    )
    await session.commitTransaction()
    return response({}, false, "Thanh toán thành công", 200)
  } catch (error: any) {
    await session.abortTransaction()
    return response({}, true, error.toString(), 500)
  } finally {
    await session.endSession()
  }
}

const fncGetDetailBooking = async (req: Request) => {
  try {
    const { BookingID } = req.params
    const { ID, RoleID } = req.user
    let bookingSchedules = [] as any[]
    const booking = await Booking.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${BookingID}`),
          [RoleID === Roles.ROLE_BARBER ? "Barber" : "Customer"]: new mongoose.Types.ObjectId(`${ID}`),
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "Customer",
          foreignField: "_id",
          as: "Customer",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account"
              }
            },
            { $unwind: '$Account' },
            {
              $addFields: {
                Email: "$Account.Email"
              }
            },
            {
              $project: {
                FullName: 1,
                AvatarPath: 1,
                Email: 1
              }
            }
          ]
        }
      },
      { $unwind: '$Customer' },
      {
        $lookup: {
          from: "users",
          localField: "Barber",
          foreignField: "_id",
          as: "Barber",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account"
              }
            },
            { $unwind: "$Account" },
            {
              $addFields: {
                Email: "$Account.Email"
              }
            },
            {
              $project: {
                _id: 1,
                FullName: 1,
                Email: 1,
                Services: 1,
                Schedules: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Barber" }
    ])
    if (!booking[0]) return response({}, true, ERROR_MESSAGE.BOOKING_NOT_EXIST, 200)
    const data = {
      ...booking[0],
      Barber: {
        ...booking[0].Barber,
        BookingSchedules: bookingSchedules
      },
      ButtonShow: {
        IsUpdate: RoleID === Roles.ROLE_USER ? true : false,
        IsConfirm: RoleID === Roles.ROLE_BARBER ? true : false,
        IsReject: true,
        IsPayment: RoleID === Roles.ROLE_USER ? true : false,
        IsComplete: RoleID === Roles.ROLE_BARBER ? true : false,
        IsFeedback: RoleID === Roles.ROLE_USER ? true : false,
      },
      ButtonDisabled: {
        IsUpdate: booking[0].BookingStatus === BOOKING_STATUS.CHO_XAC_NHAN ? false : true,
        IsConfirm: booking[0].BookingStatus === BOOKING_STATUS.CHO_XAC_NHAN ? false : true,
        IsReject: booking[0].BookingStatus === BOOKING_STATUS.CHO_XAC_NHAN ? false : true,
        IsPayment: booking[0].BookingStatus === BOOKING_STATUS.DA_XAC_NHAN && !booking[0].IsPaid ? false : true,
        IsComplete: booking[0].BookingStatus === BOOKING_STATUS.CHO_THUC_HIEN &&
          !!booking[0].IsPaid && !!moment().isAfter(booking[0].DateAt) ? false : true,
        IsFeedback: booking[0].BookingStatus === BOOKING_STATUS.DA_HOAN_THANH ? false : true
      }
    }
    return response(data, false, SUCCESS_MESSAGE.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateBooking = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { BookingID, BarberEmail, BarberName } = req.body as CreateUpdateBookingDTO
    const subject = "THÔNG BÁO KHÁCH HÀNG BOOKING"
    const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333;
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO KHÁCH HÀNG BOOKING</p>
                  <p style="margin-bottom:10px">Xin chào ${BarberName},</p>
                  <p>Khách hàng đã thay đổi lịch sử dụng dịch vụ của bạn. Hãy vào lịch sử booking của mình để kiểm tra thông tin booking.</p>
                  <div>
                    <span style="color:red; margin-right: 4px">Lưu ý:</span>
                    <span>Trong vòng 48h nếu bạn không xác nhận booking này thì booking này sẽ tự động chuyển thành "Hủy xác nhận".</span>
                  </div>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(BarberEmail, subject, content)
    if (!checkSendMail) return response({}, true, ERROR_MESSAGE.SEND_MAIL_ERROR, 200)
    const updateBooking = await Booking.findOneAndUpdate(
      {
        _id: BookingID,
        Customer: UserID
      },
      { ...req.body }
    )
    if (!updateBooking) return response({}, true, ERROR_MESSAGE.HAVE_AN_ERROR, 200)
    return response({}, false, "Chỉnh sửa booking thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetBookingScheduleOfBarber = async (req: Request) => {
  try {
    const { BarberID } = req.params
    let bookingSchedules = [] as any[]
    const bookings = await Booking
      .find({
        Barber: BarberID,
        BookingStatus: BOOKING_STATUS.CHO_THUC_HIEN
      })
      .select("Services DateAt")
    if (!!bookings.length) {
      bookings.forEach((i: any) => {
        const totalServiceTime = i.Services.reduce((sum: any, service: any) => sum + service.ServiceTime, 0)
        bookingSchedules.push({
          StartTime: i.DateAt,
          EndTime: new Date(i.DateAt.getTime() + totalServiceTime * 60000)
        })
      })
    }
    return response(bookingSchedules, false, SUCCESS_MESSAGE.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const BookingService = {
  fncCreateBooking,
  fncGetListMyBooking,
  fncChangeBookingStatus,
  fncChangeBookingPaidStatus,
  fncGetDetailBooking,
  fncUpdateBooking,
  fncGetBookingScheduleOfBarber
}

export default BookingService