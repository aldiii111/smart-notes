export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export type CreateTagInput = Omit<Tag, 'id' | 'createdAt'>;

export type UpdateTagInput = Partial<CreateTagInput>;
