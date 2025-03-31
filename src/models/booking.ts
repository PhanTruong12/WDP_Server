import mongoose from "mongoose"
import { BOOKING_STATUS } from "../utils/constant"
const Schema = mongoose.Schema

const BookingSchema = new Schema({
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  CustomerAddress: {
    type: String,
    required: true
  },
  CustomerPhone: {
    type: String,
    required: true
  },
  Services: {
    type: [
      {
        ServiceName: {
          type: String,
          required: true
        },
        ServicePrice: {
          type: Number,
          required: true
        },
        ExpensePrice: {
          type: Number,
          required: true
        },
        ServiceTime: {
          type: Number,
          required: true
        }
      }
    ],
    required: true
  },
  TotalPrice: {
    type: Number,
    required: true
  },
  TotalExpensePrice: {
    type: Number,
    required: true
  },
  IsPaid: {
    type: Boolean,
    default: false
  },
  BookingStatus: {
    type: Number,
    default: BOOKING_STATUS.CHO_XAC_NHAN
  },
  DateAt: {
    type: Date,
    required: true
  },
}, {
  timestamps: true
})

const Booking = mongoose.model("Bookings", BookingSchema)

export default Booking