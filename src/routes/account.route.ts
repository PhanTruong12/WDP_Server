import express from "express"
import AccountController from "../controllers/account.controller"

const AccountRoute = express.Router()

AccountRoute.post("/register",
  AccountController.register
)
AccountRoute.post("/login",
  AccountController.login
)
AccountRoute.get("/checkAuth",
  AccountController.checkAuth
)
AccountRoute.get("/logout",
  AccountController.logout
)

export default AccountRoute
