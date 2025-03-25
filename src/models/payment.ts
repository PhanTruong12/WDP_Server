import mongoose from "mongoose"
const Schema = mongoose.Schema

const PaymentSchema = new Schema({
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookings',
    required: true
  },
  TotalFee: {
    type: Number,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  PaymentTime: {
    type: Date,
    default: new Date()
  },
  Percent: {
    type: Number,
    required: true
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const Payment = mongoose.model("Payments", PaymentSchema)

export default Payment
