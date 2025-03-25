import { Request } from "express"
import { ErrorMessage, Roles, SuccessMessage } from "../utils/constant"
import User from "../models/user"
import response from "../utils/response"
import {
  GetListUserDTO,
  ChangeProfileDTO,
  ResponseRequestRegisterDTO,
  UpdateScheduleDTO,
  UpdateServiceDTO,
  InactiveOrActiveAccountDTO,
  GetListBarberDTO,
  UpdateResultDTO
} from "../dtos/user.dto"
import mongoose from "mongoose"
import Booking from "../models/booking"
import Account from "../models/account"

const fncGetDetailProfile = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${UserID}`)
        }
      },
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
          Account: 0
        }
      }
    ])
    if (!user[0]) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(user[0], false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeProfile = async (req: Request) => {
  try {
    const { ID } = req.user
    const user = await User
      .findOneAndUpdate(
        { _id: ID },
        {
          ...req.body as ChangeProfileDTO,
          IsFirstLogin: false
        },
        { new: true }
      )
      .lean()
    if (!user) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(user, false, "Bạn đã cập nhật thông tin thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListUser = async (req: Request) => {
  try {
    const { TextSearch, PageSize, CurrentPage, RoleID, RegisterStatus, IsActive } = req.body as GetListUserDTO
    let query = {
      FullName: { $regex: TextSearch, $options: "i" },
      RoleID: {
        $ne: Roles.ROLE_ADMIN
      }
    } as any
    if (!!RoleID) {
      query.RoleID = RoleID
    }
    if (!!RegisterStatus) {
      query.RegisterStatus = RegisterStatus
    }
    if (IsActive === true || IsActive === false) {
      query.IsActive = IsActive
    }
    const users = User.aggregate([
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
          IsActive: "$Account.IsActive",
          Email: "$Account.Email"
        }
      },
      {
        $match: query
      },
      {
        $project: {
          Account: 0
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = User.countDocuments(query)
    const result = await Promise.all([users, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsConfirm: i.RegisterStatus === 2 || !i.IsActive ? false : true,
      IsReject: i.RegisterStatus === 2 || !i.IsActive ? false : true,
    }))
    return response(
      { List: data, Total: result[1] },
      false,
      SuccessMessage.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncRequestConfirmRegister = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User.findOneAndUpdate({ _id: UserID }, { RegisterStatus: 2 }, { new: true })
    if (!user) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(user, false, "Yêu cầu của bạn đã được gửi. Hệ thống sẽ phản hồi yêu cầu của bạn trong 48h!", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncResponseRequestRegister = async (req: Request) => {
  try {
    const { UserID, RegisterStatus } = req.body as ResponseRequestRegisterDTO
    const updateUser = await User.findOneAndUpdate(
      { _id: UserID },
      { RegisterStatus }
    )
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response({}, false, "Duyệt tài khoản thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateSchedule = async (req: Request) => {
  try {
    const { ID } = req.user
    const { Schedules } = req.body as UpdateScheduleDTO
    const updateUser = await User
      .findOneAndUpdate(
        { _id: ID },
        { Schedules: Schedules },
        { new: true }
      )
      .lean()
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(updateUser, false, "Chỉnh sửa lịch thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateService = async (req: Request) => {
  try {
    const { ID } = req.user
    const { Services } = req.body as UpdateServiceDTO
    const updateUser = await User
      .findOneAndUpdate(
        { _id: ID },
        { Services: Services },
        { new: true }
      )
      .lean()
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(updateUser, false, "Chỉnh sửa dịch vụ thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBarber = async (req: Request) => {
  try {
    const { TextSearch, PageSize, CurrentPage, SortByStar } = req.body as GetListBarberDTO
    const barbers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_BARBER,
          RegisterStatus: 3,
          $or: [
            { FullName: { $regex: TextSearch, $options: "i" } },
            { Address: { $regex: TextSearch, $options: "i" } },
          ]
        }
      },
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
          IsActive: "$Account.IsActive"
        }
      },
      {
        $match: {
          IsActive: true
        }
      },
      {
        $project: {
          _id: 1,
          FullName: 1,
          Gender: 1,
          AvatarPath: 1,
          Stars: 1,
          TotalStars: { $sum: "$Stars" },
          Address: 1
        }
      },
      {
        $sort: { TotalStars: SortByStar }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize },
    ])
    return response(barbers, false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

export const fncGetDetailBarber = async (req: Request) => {
  try {
    const { BarberID } = req.params
    let bookingSchedules = [] as any[]
    if (!mongoose.Types.ObjectId.isValid(`${BarberID}`)) {
      return response({}, true, "ID barber không tồn tại", 200)
    }
    const bookings = await Booking
      .find({
        Barber: BarberID,
        BookingStatus: 4
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
    const barber = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${BarberID}`)
        }
      },
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
          _id: 1,
          FullName: 1,
          Address: 1,
          Phone: 1,
          Experiences: 1,
          Services: 1,
          Schedules: 1,
          AvatarPath: 1,
          Stars: 1,
          TotalStars: { $sum: "$Stars" },
          Email: 1,
          Results: 1
        }
      },
    ])
    if (!barber[0]) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(
      {
        ...barber[0],
        BookingSchedules: bookingSchedules
      },
      false,
      SuccessMessage.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTopBarber = async () => {
  try {
    const barbers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_BARBER,
          RegisterStatus: 3
        }
      },
      {
        $project: {
          _id: 1,
          FullName: 1,
          AvatarPath: 1,
          Stars: 1,
          TotalStars: { $sum: "$Stars" },
        }
      },
      {
        $sort: { TotalStars: -1 }
      },
      {
        $limit: 3
      }
    ])
    return response(barbers, false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncInactiveOrActiveAccount = async (req: Request) => {
  try {
    const { UserID, IsActive } = req.body as InactiveOrActiveAccountDTO
    const updateAccount = await Account.findOneAndUpdate(
      { UserID: UserID },
      { IsActive: IsActive },
      { new: true }
    )
    if (!updateAccount) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(
      {},
      false,
      !!IsActive
        ? "Tài khoản đã được mở khóa"
        : "Tài khoản đã bị khóa",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateResult = async (req: Request) => {
  try {
    const { ID } = req.user
    const { Results } = req.body as UpdateResultDTO
    const updateUser = await User
      .findOneAndUpdate(
        { _id: ID },
        { Results: Results },
        { new: true }
      )
      .lean()
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(updateUser, false, "Chỉnh sửa thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const UserService = {
  fncGetDetailProfile,
  fncChangeProfile,
  fncGetListUser,
  fncRequestConfirmRegister,
  fncResponseRequestRegister,
  fncUpdateSchedule,
  fncUpdateService,
  fncGetListBarber,
  fncGetDetailBarber,
  fncGetListTopBarber,
  fncInactiveOrActiveAccount,
  fncUpdateResult
}

export default UserService
