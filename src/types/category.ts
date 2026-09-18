export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt'>;
