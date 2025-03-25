import iconv from 'iconv-lite'
import { Request } from "express"
import response from "../utils/response"

const fncUploadFileList = async (req: Request) => {
  try {
    return response(
      !!(req.files as any)["FileList[]"]
        ? (req.files as any)["FileList[]"].map((i: any) => i.path)
        : [],
      false,
      "Upload file thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUploadFileSingle = async (req: Request) => {
  try {
    return response(
      (req.file as any).path,
      false,
      "Upload file thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUploadDocumentList = async (req: Request) => {
  try {
    const documents = (req.files as any)["DocumentList[]"].map((i: any) => {
      const buffer = Buffer.from(i.originalname, 'latin1')
      const docName = iconv.decode(buffer, 'utf8')
      return {
        DocName: docName,
        DocPath: i.path
      }
    })
    return response(documents, false, "Upload file thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const FileService = {
  fncUploadFileList,
  fncUploadFileSingle,
  fncUploadDocumentList
}

export default FileService
