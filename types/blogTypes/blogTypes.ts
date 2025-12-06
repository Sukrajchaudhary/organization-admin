export interface RootBlogs {
  success: boolean;
  message: string;
  data: RootBlogsData[];
  pagination: RootBlogsPagination;
}

export interface RootBlogsData {
  _id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  readTime: number;
  status: string;
  draft: boolean;
  likes: RootBlogsDataLikes[];
  meta: RootBlogsDataMeta;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RootBlogsDataLikes {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface RootBlogsDataMeta {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface RootBlogsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type CreateBlogData = Omit<RootBlogsData, '_id' | 'likes' | 'createdAt' | 'updatedAt' | '__v'>;