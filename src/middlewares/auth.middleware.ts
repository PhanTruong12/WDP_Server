import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import response from '../utils/response'

const authMiddleware = (Roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
      res.status(401).json(
        response({}, true, 'Không có token', 401)
      )
    }
    const token = req.cookies.token
    jwt.verify(token, process.env.ACCESS_TOKEN || "access_token", (err: any, decode: any) => {
      if (err) {
        return res.status(401).json(
          response({}, true, err.toString(), 401)
        )
      }
      const { payload } = decode
      if (Roles.includes(payload.RoleID)) {
        req.user = payload
        next()
      } else {
        return res.status(403).json(
          response({}, true, 'Bạn không có quyền', 403)
        )
      }
    })
  }
}

export default authMiddleware
