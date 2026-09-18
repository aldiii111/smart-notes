export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export type CreateFolderInput = Omit<Folder, 'id' | 'createdAt'>;
