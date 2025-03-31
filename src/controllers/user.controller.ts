import { Request, Response } from "express"
import UserService from "../services/user.service"

const getDetailProfile = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncGetDetailProfile(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const changeProfile = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncChangeProfile(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListUser = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncGetListUser(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const requestConfirmRegister = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncRequestConfirmRegister(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const responseRequestRegister = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncResponseRequestRegister(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const updateSchedule = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncUpdateSchedule(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const updateService = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncUpdateService(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListBarber = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncGetListBarber(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getDetailBarber = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncGetDetailBarber(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListTopBarber = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncGetListTopBarber()
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const inactiveOrActiveAccount = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncInactiveOrActiveAccount(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const updateResult = async (req: Request, res: Response) => {
  try {
    const response = await UserService.fncUpdateResult(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const UserController = {
  getDetailProfile,
  changeProfile,
  getListUser,
  requestConfirmRegister,
  responseRequestRegister,
  updateSchedule,
  updateService,
  getListBarber,
  getDetailBarber,
  getListTopBarber,
  inactiveOrActiveAccount,
  updateResult
}

export default UserController