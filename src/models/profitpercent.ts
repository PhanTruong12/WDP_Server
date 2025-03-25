import mongoose from "mongoose"
const Schema = mongoose.Schema

const ProfitPercentSchema = new Schema({
  Percent: {
    type: Number,
    require: true
  }
})

const ProfitPercent = mongoose.model("ProfitPercents", ProfitPercentSchema)

export default ProfitPercent
