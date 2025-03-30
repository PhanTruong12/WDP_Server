import { Request, Response } from "express"
import Account from "../models/account"
import User from "../models/user"
import { ERROR_MESSAGE, REGISTER_STATUS, Roles } from "../utils/constant"
import { getOneDocument } from "../utils/queryFunction"
import response from "../utils/response"
import {
  LoginDTO,
  RegisterDTO
} from "../dtos/account.dto"
import { signAccessToken } from "../utils/tokenUtils"
import mongoose from "mongoose"

const fncRegister = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { Email, RoleID } = req.body as RegisterDTO
    const checkExist = await getOneDocument(Account, "Email", Email)
    if (!!checkExist) return response({}, true, ERROR_MESSAGE.EMAIL_EXIST, 200)
    const user = await User
      .create(
        [{
          ...req.body,
          RegisterStatus: RoleID === Roles.ROLE_USER ? REGISTER_STATUS.DA_DUYET : REGISTER_STATUS.MOI_TAO,
          IsFirstLogin: RoleID === Roles.ROLE_BARBER ? true : false
        }],
        { session: session }
      )
    await Account.create(
      [{
        UserID: user[0]._id,
        Email,
        RoleID: RoleID,
      }],
      { session: session }
    )
    const token = signAccessToken({
      ID: user[0]._id,
      RoleID: RoleID,
    })
    await session.commitTransaction()
    res.cookie("token", token, {
      httpOnly: true, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: "none",
      maxAge: 6 * 60 * 60 * 1000 // 8h
    })
    return response(token, false, "Đăng ký tài khoản thành công", 200)
  } catch (error: any) {
    await session.abortTransaction()
    return response({}, true, error.toString(), 500)
  } finally {
    await session.endSession()
  }
}

const fncCheckAuth = async (req: Request) => {
  try {
    return response(
      !!req.cookies.token ? req.cookies.token : false,
      false,
      `${!!req.cookies.token ? "Có token" : "Không có token"}`,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncLogin = async (req: Request, res: Response) => {
  try {
    const { Email } = req.body as LoginDTO
    const getAccount = await getOneDocument(Account, "Email", Email)
    if (!getAccount) return response({}, true, ERROR_MESSAGE.EMAIL_NOT_EXIST, 200)
    if (!getAccount.IsActive) return response({}, true, ERROR_MESSAGE.ACCOUNT_INACTIVE, 200)
    const token = signAccessToken({
      ID: getAccount.UserID,
      RoleID: getAccount.RoleID,
    })
    res.cookie("token", token, {
      httpOnly: true, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: "none",
      maxAge: 6 * 60 * 60 * 1000 // 8h
    })
    return response(token, false, "Login thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const AccountService = {
  fncRegister,
  fncLogin,
  fncCheckAuth,
}

export default AccountService