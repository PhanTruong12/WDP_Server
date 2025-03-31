import SocketService, { userOnlines } from "./socket.service"

const socket = (io: any) => {

  io.on("connection", (socket: any) => {

    console.log(`người dùng ${socket.id} đã kết nối`)

    socket.on("add-user-online", SocketService.addUserOnline(socket))

    socket.on("change-bookingstatus", SocketService.changeBookingStatus(socket))

    socket.on("inactive-account", SocketService.inactiveAccount(socket))

    socket.on('disconnect', () => {
      console.log(`người dùng ${socket.id} đã ngắt kết nối`)
      const index = userOnlines.findIndex((i: any) => i.SocketID === socket.id)
      userOnlines.splice(index, 1)
      console.log("userOnlines", userOnlines)
    })
  })

}

export default socket