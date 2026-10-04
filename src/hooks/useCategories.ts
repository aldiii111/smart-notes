import { useNotesProvider } from "@/contexts/NotesContext";
import { toast } from "sonner";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import { useCallback } from "react";

export function useCategories() {
    const { categories, addCategory, updateCategory, deleteCategory } = useNotesProvider();

    const createCategory = useCallback((data: CreateCategoryInput) => {
        addCategory(data);
        toast.success("Kategori berhasil dibuat");
    }, [addCategory]);

    const editCategory = useCallback((id: string, data: UpdateCategoryInput) => {
        updateCategory(id, data);
        toast.success("Kategori berhasil diubah");
    }, [updateCategory]);

    const removeCategory = useCallback((id: string) => {
        deleteCategory(id);
        toast.success("Kategori berhasil dihapus");
    }, [deleteCategory]);

    return { categories, createCategory, editCategory, removeCategory };
}
