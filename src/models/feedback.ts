import mongoose from "mongoose"
const Schema = mongoose.Schema

const FeedbackSchema = new Schema({
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  Content: {
    type: String,
    required: true
  },
  Rate: {
    type: Number,
    require: true
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const Feedback = mongoose.model("Feedbacks", FeedbackSchema)

export default Feedback