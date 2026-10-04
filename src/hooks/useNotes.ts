import { useNotesProvider } from "@/contexts/NotesContext";
import { toast } from "sonner";
import type { Note, CreateNoteInput, UpdateNoteInput } from "@/types/note";
import { useCallback } from "react";

export function useNotes() {
    const { notes, addNote, updateNote, deleteNote } = useNotesProvider()

    const getNoteById = useCallback((id: string): Note | undefined => {
        return notes.find((n) => n.id === id)
    }, [notes])

    const createNote = useCallback((data: CreateNoteInput) => {
        addNote(data)
        toast.success("Catatan berhasil dibuat")
    }, [addNote])

    const editNote = useCallback((id: string, data: UpdateNoteInput) => {
        updateNote(id, data)
        toast.success("Catatan berhasil diperbarui")
    }, [updateNote])

    const removeNote = useCallback((id: string) => {
        deleteNote(id)
        toast.success("Catatan berhasil dihapus")
    }, [deleteNote])

    return { notes, getNoteById, createNote, editNote, removeNote }
}