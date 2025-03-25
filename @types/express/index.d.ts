declare global {
  namespace Express {
    interface Request {
      user: {
        ID: string,
        RoleID: number
      }
    }
  }
}

export { }