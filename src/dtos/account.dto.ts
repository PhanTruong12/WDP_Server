export interface RegisterDTO {
  Email: string,
  RoleID: number,
  FullName: string,
  AvatarPath: string
}

export interface LoginDTO {
  Email: string,
}