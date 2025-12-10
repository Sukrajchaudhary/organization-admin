export interface RootQueries {
  success: boolean;
  message: string;
  data: RootQueriesData;
}

export interface RootQueriesData {
  queries: Query[];
  pagination: RootQueriesPagination;
}

export interface Query {
  _id: string;
  subject: string;
  email: string;
  phoneNumber: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RootQueriesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type CreateQueryData = Omit<Query, '_id' | 'createdAt' | 'updatedAt' | '__v'>;