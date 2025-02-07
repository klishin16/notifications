export interface IPagination {
  skip?: number;
  limit?: number;
  sort?: { field: string; direction: 'ASC' | 'DESC' }[];
  search?: { field: string; value: string }[];
}
