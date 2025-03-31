import { Request } from "express"
import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import { Roles, SUCCESS_MESSAGE } from "../utils/constant"
import SystemKey from "../models/systemkey"
import {
  CreateSystemKeyDTO,
  InsertParentKeyDTO
} from "../dtos/systemkey.dto"
import ProfitPercent from "../models/profitpercent"

const ProfitPercentID = "67c842e8d34722ce27a4681f"

const getTabs = (RoleID: number) => {
  let tabs = [] as any[]
  if (RoleID === Roles.ROLE_ADMIN) {
    tabs = [1, 2, 3, 4, 5]
  } else if (RoleID === Roles.ROLE_BARBER) {
    tabs = [1, 2, 3, 4, 5, 7]
  } else if (RoleID === Roles.ROLE_USER) {
    tabs = [1, 5, 6, 7]
  }
  return tabs
}

const fncGetListSystemKey = async () => {
  try {
    const systemKeys = await SystemKey.find()
    return response(systemKeys, false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncCreateSystemKey = async (req: Request) => {
  try {
    await SystemKey.create(req.body as CreateSystemKeyDTO)
    return response({}, false, "Thêm systemkey thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncInsertParentKey = async (req: Request) => {
  try {
    const { KeyName, ParentName } = req.body as InsertParentKeyDTO
    const systemKey = await getOneDocument(SystemKey, "KeyName", KeyName)
    if (!systemKey) return response({}, true, "Key name không tồn tại", 200)
    const lastParent = systemKey.Parents[systemKey?.Parents.length - 1]
    const newData = {
      ParentID: lastParent.ParentID + 1,
      ParentName: ParentName
    }
    await SystemKey.updateOne(
      { KeyName },
      {
        $push: {
          Parents: newData
        }
      },
      { new: true }
    )
    return response({}, false, "Thêm ParentKey thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTab = async (req: Request) => {
  try {
    const { RoleID } = req.user
    const tabs = getTabs(RoleID)
    return response(tabs, false, SUCCESS_MESSAGE.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetProfitPercent = async () => {
  try {
    const percent = await getOneDocument(ProfitPercent, "_id", ProfitPercentID)
    return response(percent, false, SUCCESS_MESSAGE.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeProfitPercent = async (req: Request) => {
  try {
    const { Percent } = req.body as { Percent: number }
    const updatePercent = await ProfitPercent.findOneAndUpdate(
      {
        _id: ProfitPercentID
      },
      {
        Percent: Percent
      },
      { new: true }
    )
    return response(updatePercent, false, "Cập nhật phần trăm lợi nhuận thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const CommonService = {
  fncGetListSystemKey,
  fncCreateSystemKey,
  fncInsertParentKey,
  fncGetListTab,
  fncGetProfitPercent,
  fncChangeProfitPercent,
}

export default CommonService