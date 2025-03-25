export interface SendNotificationDTO {
  Content: string,
  IsSeen: boolean,
  _id: string,
  Type: string,
  IsNew: boolean,
  Receiver: string,
  createdAt: Date
}

export interface SendFeedbackDTO {
  Rate: number,
  Content: string,
  User: {
    FullName: string,
    AvatarPath: string
  },
  RoomID: string,
  createdAt: Date
}

export interface SendMessageDTO {
  Content: string,
  ChatID?: string,
  Receiver: string,
  Sender: {
    _id: string,
    FullName: string,
    AvatarPath: string
  },
  createdAt: Date
}

export interface JoinMeetingRoomDTO {
  UserID: string,
  FullName: string,
  Avatar: string,
  RoomID: string,
  PeerID: string,
  IsViewVideo: boolean,
  Muted: boolean
}

export interface ToggleHandlerDTO {
  RoomID: string,
  PeerID: string,
  Key: string
}

export interface LeaveMeetingRoomDTO {
  RoomID: object,
  PeerID: string,
}

export interface SendMessageMeetingRoomDTO {
  RoomID: string,
  Content: string,
  Sender: {
    _id: string,
    FullName: string,
    AvatarPath: string
  }
}
