export interface CategoryMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  image: string;
  meta: CategoryMeta;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryCreate {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  meta: CategoryMeta;
  image: string;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {
  _id: string;
}