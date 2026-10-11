export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export type CreateFolderInput = Omit<Folder, 'id' | 'createdAt'>;

export type UpdateFolderInput = Partial<CreateFolderInput>;
