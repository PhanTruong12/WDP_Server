import { ObjectId } from "mongoose"
import { PaginationDTO } from "./common.dto"

export interface CreateFeedbackDTO {
  Barber: ObjectId,
  Content: string,
  Rate: number
}

export interface GetListFeedbackOfBarberDTO extends PaginationDTO {
  BarberID: ObjectId
}
