export interface ApiResponse {
  message: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  sortBy: string;
  dir: string;
  totalPages: number;
  total: number;
  results: any[];
}
