import mongoose from "mongoose"
import { REGISTER_STATUS } from "../utils/constant"
const Schema = mongoose.Schema

const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    default: null
  },
  Phone: {
    type: String,
    default: null
  },
  DateOfBirth: {
    type: Date,
    default: null
  },
  AvatarPath: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
  },
  RoleID: {
    type: Number,
    required: true
  },
  Gender: {
    type: Number,
    default: null
  },
  Experiences: {
    type: String,
    default: null
  },
  Certificates: {
    type: [String],
    default: []
  },
  IsFirstLogin: {
    type: Boolean,
    default: true
  },
  RegisterStatus: {
    type: Number,
    default: REGISTER_STATUS.MOI_TAO
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
    default: []
  },
  Schedules: {
    type: [
      {
        DateAt: { type: String },
        StartTime: { type: Date },
        EndTime: { type: Date }
      }
    ],
    default: []
  },
  Stars: {
    type: [
      { type: Number }
    ],
    default: []
  },
  Results: {
    type: [
      { type: String }
    ],
    default: []
  },
}, {
  timestamps: true
})

const User = mongoose.model("Users", UserSchema)

export default User