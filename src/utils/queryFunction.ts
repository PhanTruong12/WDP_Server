export const getOneDocument = async (model: any, filed: any, value: any) => {
  const data = await model.findOne({ [filed]: value }).lean()
  return data
}
