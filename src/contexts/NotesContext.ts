import { createContext, useContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { Note, CreateNoteInput, UpdateNoteInput } from "@/types/note";
import type { Folder, CreateFolderInput, UpdateFolderInput } from "@/types/folder";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import type { Tag, CreateTagInput, UpdateTagInput } from "@/types/tag";
import {
    getNotes,
    saveNotes,
    getFolders,
    saveFolders,
    getCategories,
    saveCategories,
    getTags,
    saveTags,
} from "@/hooks/useLocalStorage";

interface NotesContextType {
    notes: Note[];
    folders: Folder[];
    categories: Category[];
    tags: Tag[];

    addNote: (data: CreateNoteInput) => void;
    updateNote: (id: string, data: UpdateNoteInput) => void
    deleteNote: (id: string) => void

    addFolder: (data: CreateFolderInput) => void;
    updateFolder: (id: string, data: UpdateFolderInput) => void;
    deleteFolder: (id: string) => void;

    addCategory: (data: CreateCategoryInput) => void;
    updateCategory: (id: string, data: UpdateCategoryInput) => void;
    deleteCategory: (id: string) => void;

    addTag: (data: CreateTagInput) => void;
    updateTag: (id: string, data: UpdateTagInput) => void;
    deleteTag: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
    const [note, setNote] = useState<Note[]>(getNotes())
    const [folder, setFolder] = useState<Folder[]>(getFolders())
    const [category, setCategory] = useState<Category[]>(getCategories())
    const [tag, setTag] = useState<Tag[]>(getTags())

    const addNote = useCallback((data: CreateNoteInput) => {
        const newNote: Note = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        setNote((prev) => {
            const updated = [newNote, ...prev]
            saveNotes(updated)
            return updated
        })
    }, [])

    const updateNote = useCallback((id: string, data: UpdateNoteInput) => {
        setNote((prev) => {
            const updated = prev.map((n) => 
                n.id === id ? {
                    ...n,
                    ...data,
                    updatedAt: new Date().toISOString()
                } : n
            )
            saveNotes(updated)
            return updated
        })
    }, [])

    const deleteNote = useCallback((id: string) => {
        setNote((prev) => {
            const deleted = prev.filter((n) => n.id !== id)
            saveNotes(deleted)
            return deleted
        })
    }, [])

    const addFolder = useCallback((data: CreateFolderInput) => {
        const newFolder: Folder = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        }
        setFolder((prev) => {
            const updated = [newFolder, ...prev]
            saveFolders(updated)
            return updated
        })
    }, [])

    const updateFolder = useCallback((id: string, data: UpdateFolderInput) => {
        setFolder((prev) => {
            const updated = prev.map((n) => 
                n.id === id ? {
                    ...n,
                    ...data,
                    createdAt: new Date().toISOString()
                } : n
            )
            saveFolders(updated)
            return updated
        })
    }, [])
}