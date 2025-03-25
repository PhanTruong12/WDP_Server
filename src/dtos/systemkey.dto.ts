export interface CreateSystemKeyDTO {
  KeyName: string,
  Parents: {
    ParentID: number,
    ParentName: string,
    ParentCode: string,
    AvatarPath: string
  }[]
}

export interface InsertParentKeyDTO {
  KeyName: string,
  ParentName: string,
  ParentCode: string,
  AvatarPath: string
}