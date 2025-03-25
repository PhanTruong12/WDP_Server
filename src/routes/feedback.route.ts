import express from "express"
import FeedbackController from "../controllers/feedback.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const FeedbackRoute = express.Router()

FeedbackRoute.post("/createFeedback",
  authMiddleware([Roles.ROLE_USER]),
  FeedbackController.createFeedback
)
FeedbackRoute.post("/getListFeedbackOfBarber",
  FeedbackController.getListFeedbackOfBarber
)
FeedbackRoute.get("/deleteFeedback/:FeedbackID",
  authMiddleware([Roles.ROLE_ADMIN]),
  FeedbackController.deletedFeedback
)
FeedbackRoute.post("/getListFeedback",
  authMiddleware([Roles.ROLE_ADMIN]),
  FeedbackController.getListFeedback
)


export default FeedbackRoute
