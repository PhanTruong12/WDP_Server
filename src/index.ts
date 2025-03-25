import express from "express"
import http from "http"
import cors from "cors"
import { Server } from 'socket.io'
import * as dotenv from 'dotenv'
dotenv.config()
import cookieParser from "cookie-parser"
import connect from "./config/DBConfig"
import routes from "./routes"
import socket from "./sockets"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

const allowOrigins = [
  "http://localhost:5173",
]

app.use(cors({
  origin: allowOrigins,
  credentials: true,
}))

app.use(cookieParser())

app.use(express.json())

routes(app)

socket(io)

server.listen(process.env.PORT, async () => {
  await connect()
  console.log(`App listening at http://localhost:${process.env.PORT}`)
})

export default app