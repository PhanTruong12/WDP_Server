export interface RegisterDTO {
  Email: string,
  RoleID: number,
  FullName: string,
  AvatarPath: string
}

export interface LoginDTO {
  Email: string,
}

export interface ChangePasswordDTO {
  OldPassword: string,
  NewPassword: string
}

export interface ForgotPasswordDTO {
  Email: string,
  Step: number,
  Password: string
}