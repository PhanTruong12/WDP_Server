import moment from "moment"
import Booking from "../models/booking"

const checkBookingExpired = async () => {
  try {
    console.log("cron job checkBookingExpired")
    const bookings = await Booking
      .find({
        $or: [
          { BookingStatus: 1 },
          {
            BookingStatus: 2,
            IsPaid: false
          }
        ],
        createdAt: {
          $lt: moment().subtract(48, 'hours').toDate()
        }
      })
      .lean()
    const promiseUpdate = bookings.map((i: any) =>
      Booking.updateOne(
        { _id: i._id },
        { BookingStatus: 3 }
      )
    )
    await Promise.all(promiseUpdate)
  } catch (error: any) {
    console.log("error cron job checkConfirmExpire", error.toString())
  }
}

export default checkBookingExpired