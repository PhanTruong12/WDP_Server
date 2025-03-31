import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface ChangeProfileDTO {
  FullName: string,
  Address: string,
  Phone: string,
  DateOfBirth: Date,
  Gender: number,
  Experiences: string,
  Certificates: string[],
  AvatarPath: string
}

export interface GetListUserDTO extends CommonDTO {
  RoleID: number,
  RegisterStatus: number,
  IsActive: boolean
}

export interface ResponseRequestRegisterDTO {
  UserID: ObjectId,
  RegisterStatus: number
}

export interface UpdateScheduleDTO {
  Schedules: {
    DateAt: string,
    StartTime: Date,
    EndTime: Date
  }[]
}

export interface UpdateServiceDTO {
  Services: {
    ServiceName: string,
    ServicePrice: number,
    ExpensePrice: number,
    ServiceTime: number
  }[]
}

export interface GetListBarberDTO extends CommonDTO {
  SortByStar: 1 | -1,
  AddressSearch: string
}

export interface InactiveOrActiveAccountDTO {
  UserID: ObjectId,
  IsActive: boolean,
}

export interface UpdateResultDTO {
  Results: string[]
}