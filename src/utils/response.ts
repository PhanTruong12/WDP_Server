const response = (data: any, isError: boolean, msg: string, statusCode: number) => {
  return { data, isError, msg, statusCode }
}

export default response
