export interface PaginationParams {
  page?: number;      // Default: 1
  limit?: number;     // Default: 12
  categoryId?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
