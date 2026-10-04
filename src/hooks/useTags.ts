import { useNotesProvider } from "@/contexts/NotesContext";
import { toast } from "sonner";
import type { CreateTagInput, UpdateTagInput } from "@/types/tag";
import { useCallback } from "react";

export function useTags() {
    const { tags, addTag, updateTag, deleteTag } = useNotesProvider();

    const createTag = useCallback((data: CreateTagInput) => {
        addTag(data);
        toast.success("Tag berhasil dibuat");
    }, [addTag]);

    const editTag = useCallback((id: string, data: UpdateTagInput) => {
        updateTag(id, data);
        toast.success("Tag berhasil diubah");
    }, [updateTag]);

    const removeTag = useCallback((id: string) => {
        deleteTag(id);
        toast.success("Tag berhasil dihapus");
    }, [deleteTag]);

    return { tags, createTag, editTag, removeTag };
}
