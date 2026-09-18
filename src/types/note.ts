export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  categoryId: string | null;
  tagIds: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateNoteInput = Partial<CreateNoteInput>;
