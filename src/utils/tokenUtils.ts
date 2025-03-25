import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import * as dotenv from "dotenv"
dotenv.config()

interface PayloadToken {
  ID: mongoose.Types.ObjectId,
  RoleID: number
}

export const signAccessToken = (payload: PayloadToken) => {
  const access_token = jwt.sign(
    { payload },
    process.env.ACCESS_TOKEN || "access_token",
    { expiresIn: '8h' }
  )
  return access_token
}

export const signRefreshToken = (payload: PayloadToken) => {
  const refresh_token = jwt.sign(
    { payload },
    process.env.REFRESH_TOKEN || "refresh_token",
    { expiresIn: '8h' }
  )
  return refresh_token
}
