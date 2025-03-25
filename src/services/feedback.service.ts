import { CommonDTO } from "../dtos/common.dto"
import {
  CreateFeedbackDTO,
  GetListFeedbackOfBarberDTO
} from "../dtos/feedback.dto"
import Feedback from "../models/feedback"
import User from "../models/user"
import { ErrorMessage } from "../utils/constant"
import response from "../utils/response"
import { Request } from "express"

const fncCreateFeedback = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { Barber, Rate } = req.body as CreateFeedbackDTO
    const newFeedback = await Feedback.create({ ...req.body, Customer: UserID })
    await User.findOneAndUpdate(
      { _id: Barber },
      { $push: { Stars: Rate } }
    )
    return response(newFeedback, false, "Gửi đánh giá thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListFeedbackOfBarber = async (req: Request) => {
  try {
    const { CurrentPage, PageSize, BarberID } = req.body as GetListFeedbackOfBarberDTO
    let query = {
      Barber: BarberID,
      IsDeleted: false
    }
    const feedbacks = Feedback
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .sort({ createdAt: -1 })
      .populate("Customer", ["FullName", "AvatarPath"])
    const total = Feedback.countDocuments(query)
    const result = await Promise.all([feedbacks, total])
    return response(
      {
        List: result[0],
        Total: result[1]
      },
      false,
      "Lấy ra thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteFeedback = async (req: Request) => {
  try {
    const { FeedbackID } = req.params
    const deleteFeedback = await Feedback.findByIdAndUpdate(
      FeedbackID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deleteFeedback) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(deleteFeedback, false, "Xóa Messenger thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListFeedback = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize } = req.body as CommonDTO
    const feedbacks = Feedback.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "Customer",
          foreignField: "_id",
          as: "Customer",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Customer" },
      {
        $lookup: {
          from: "users",
          localField: "Barber",
          foreignField: "_id",
          as: "Barber",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Barber" },
      {
        $match: {
          $or: [
            { "Customer.FullName": { $regex: TextSearch, $options: "i" } },
            { "Barber.FullName": { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = Feedback.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "Customer",
          foreignField: "_id",
          as: "Customer",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Customer" },
      {
        $lookup: {
          from: "users",
          localField: "Barber",
          foreignField: "_id",
          as: "Barber",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Barber" },
      {
        $match: {
          $or: [
            { "Customer.FullName": { $regex: TextSearch, $options: "i" } },
            { "Barber.FullName": { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      {
        $group: {
          _id: "$_id"
        }
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([feedbacks, total])
    return response(
      {
        List: result[0],
        Total: !!result[1].length ? result[1][0].total : 0,
      },
      false,
      "Lay dat thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const FeedbackSerivce = {
  fncCreateFeedback,
  fncDeleteFeedback,
  fncGetListFeedbackOfBarber,
  fncGetListFeedback
}

export default FeedbackSerivce
