export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt'>;

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
