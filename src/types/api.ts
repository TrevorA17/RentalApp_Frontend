export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  sort: string;
};

export type ApiErrorItem = {
  field?: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ApiErrorItem[];
  code?: string;
};
