export interface RootCategories {
  success: boolean;
  message: string;
  data: RootCategoryData[];
  pagination: RootCategoryPagination;
}

export interface RootCategoryData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  meta: RootCategoryDataMeta;
  image?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface RootCategoryDataMeta {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface RootCategoryPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type CreateCategoryData = Omit<RootCategoryData, '_id' | 'createdAt' | 'updatedAt' | '__v'>;

// Legacy type aliases for backwards compatibility
export type Category = RootCategoryData;
export type CategoryMeta = RootCategoryDataMeta;
export type CategoryCreate = CreateCategoryData;