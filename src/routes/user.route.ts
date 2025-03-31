import express from "express"
import UserController from "../controllers/user.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const UserRoute = express.Router()

UserRoute.get("/getDetailProfile",
  authMiddleware([Roles.ROLE_BARBER, Roles.ROLE_ADMIN, Roles.ROLE_USER]),
  UserController.getDetailProfile
)
UserRoute.post("/changeProfile",
  authMiddleware([Roles.ROLE_BARBER, Roles.ROLE_USER]),
  UserController.changeProfile
)
UserRoute.post("/getListUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserController.getListUser
)
UserRoute.get("/requestConfirmRegister",
  authMiddleware([Roles.ROLE_BARBER]),
  UserController.requestConfirmRegister
)
UserRoute.post("/responseRequestRegister",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserController.responseRequestRegister
)
UserRoute.post("/updateSchedule",
  authMiddleware([Roles.ROLE_BARBER]),
  UserController.updateSchedule
)
UserRoute.post("/updateService",
  authMiddleware([Roles.ROLE_BARBER]),
  UserController.updateService
)
UserRoute.post("/getListBarber",
  UserController.getListBarber
)
UserRoute.get("/getDetailBarber/:BarberID",
  UserController.getDetailBarber
)
UserRoute.get("/getListTopBarber",
  UserController.getListTopBarber
)
UserRoute.post("/inactiveOrActiveAccount",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserController.inactiveOrActiveAccount
)
UserRoute.post("/updateResult",
  authMiddleware([Roles.ROLE_BARBER]),
  UserController.updateResult
)

export default UserRoute