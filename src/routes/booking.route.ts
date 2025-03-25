import express from "express"
import BookingController from "../controllers/booking.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const BookingRoute = express.Router()

BookingRoute.post("/createBooking",
  authMiddleware([Roles.ROLE_USER]),
  BookingController.createBooking
)
BookingRoute.post("/getListMyBooking",
  authMiddleware([Roles.ROLE_USER, Roles.ROLE_BARBER]),
  BookingController.getListMyBooking
)
BookingRoute.post("/changeBookingStatus",
  authMiddleware([Roles.ROLE_USER, Roles.ROLE_BARBER]),
  BookingController.changeBookingStatus
)
BookingRoute.post("/changeBookingPaidStatus",
  authMiddleware([Roles.ROLE_USER]),
  BookingController.changeBookingPaidStatus
)
BookingRoute.get("/getDetailBooking/:BookingID",
  authMiddleware([Roles.ROLE_USER, Roles.ROLE_BARBER]),
  BookingController.getDetailBooking
)
BookingRoute.post("/updateBooking",
  authMiddleware([Roles.ROLE_USER]),
  BookingController.updateBooking
)
BookingRoute.get("/getBookingScheduleOfBarber/:BarberID",
  BookingController.getBookingScheduleOfBarber
)

export default BookingRoute
