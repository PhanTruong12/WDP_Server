import express from "express"
import FileController from "../controllers/file.controller"
import upload from '../middlewares/clouddinary.middleware'

const FileRoute = express.Router()

FileRoute.post("/uploadFileList",
  upload("FileList").fields([{ name: 'FileList[]' }]),
  FileController.uploadFileList
)
FileRoute.post("/uploadFileSingle",
  upload("FileSingle").single("FileSingle"),
  FileController.uploadFileSingle
)
FileRoute.post("/uploadDocumentList",
  upload("DocumentList").fields([{ name: "DocumentList[]" }]),
  FileController.uploadDocumentList
)

export default FileRoute
