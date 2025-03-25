export interface PaginationDTO {
  CurrentPage: number,
  PageSize: number
}

export interface CommonDTO extends PaginationDTO {
  TextSearch: string,
}
