import express from "express"
import StatisticController from "../controllers/statistic.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const StatisticRoute = express.Router()

StatisticRoute.get("/statisticTotalBookingByBarber",
  authMiddleware([Roles.ROLE_BARBER]),
  StatisticController.statisticTotalBookingByBarber
)
StatisticRoute.post("/statisticServiceBooking",
  authMiddleware([Roles.ROLE_BARBER]),
  StatisticController.statisticServiceBooking
)
StatisticRoute.get("/statisticTotalBooking",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticTotalBooking
)
StatisticRoute.get("/statisticTotalAccount",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticTotalAccount
)

export default StatisticRoute