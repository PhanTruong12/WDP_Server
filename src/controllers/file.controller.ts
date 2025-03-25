import { Request, Response } from "express"
import FileService from "../services/file.service"

const uploadFileList = async (req: Request, res: Response) => {
  try {
    const response = await FileService.fncUploadFileList(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const uploadFileSingle = async (req: Request, res: Response) => {
  try {
    const response = await FileService.fncUploadFileSingle(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const uploadDocumentList = async (req: Request, res: Response) => {
  try {
    const response = await FileService.fncUploadDocumentList(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const FileController = {
  uploadFileList,
  uploadFileSingle,
  uploadDocumentList
}

export default FileController
