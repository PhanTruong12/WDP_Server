import { Roles } from "../utils/constant"
import {
  JoinMeetingRoomDTO,
  LeaveMeetingRoomDTO,
  SendFeedbackDTO,
  SendMessageDTO,
  SendMessageMeetingRoomDTO,
  SendNotificationDTO,
  ToggleHandlerDTO,
} from "./socket.dto"

export let userOnlines = [] as any

const addUserOnline = (socket: any) => {
  return (data: string) => {
    if (!!data) {
      const user = userOnlines.find((i: any) => i.UserID === data)
      if (!user) {
        userOnlines.push({
          UserID: data,
          SocketID: socket.id
        })
      }
      console.log("userOnlines", userOnlines)
    }
  }
}

const changeBookingStatus = (socket: any) => {
  return (data: any) => {
    const user = userOnlines.find((i: any) => i.UserID === data.Receiver)
    if (!!user) {
      socket.to(user.SocketID).emit('listen-change-bookingstatus', data)
    }
  }
}

const inactiveAccount = (socket: any) => {
  return (data: String) => {
    const user = userOnlines.find((i: any) => i.UserID === data)
    if (!!user) {
      socket.to(user.SocketID).emit('listen-inactive-account', data)
    }
  }
}

const SocketService = {
  addUserOnline,
  changeBookingStatus,
  inactiveAccount
}

export default SocketService
