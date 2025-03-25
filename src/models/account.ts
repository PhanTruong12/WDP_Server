import mongoose from "mongoose"
const Schema = mongoose.Schema

const AccountSchema = new Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  RoleID: {
    type: Number,
    required: true
  },
  IsActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
})

const Account = mongoose.model("Accounts", AccountSchema)

export default Account
