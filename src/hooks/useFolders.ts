import { useNotesProvider } from "@/contexts/NotesContext";
import { toast } from "sonner";
import type { CreateFolderInput, UpdateFolderInput } from "@/types/folder";
import { useCallback } from "react";

export function useFolders() {
    const { folders, addFolder, updateFolder, deleteFolder } = useNotesProvider();

    const createFolder = useCallback((data: CreateFolderInput) => {
        addFolder(data);
        toast.success("Folder berhasil dibuat");
    }, [addFolder]);

    const editFolder = useCallback((id: string, data: UpdateFolderInput) => {
        updateFolder(id, data);
        toast.success("Folder berhasil diubah");
    }, [updateFolder]);

    const removeFolder = useCallback((id: string) => {
        deleteFolder(id);
        toast.success("Folder berhasil dihapus");
    }, [deleteFolder]);

    return { folders, createFolder, editFolder, removeFolder };
}
