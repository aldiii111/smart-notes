import { useSearchParams } from "react-router";
import { useNotes } from "./useNotes";
import { useCallback, useMemo } from "react";

export function useSearch(
    filterType: "all" | "folder" | "category" | "tag" = "all",
    filterId?: string | null
) {
    const [searchParams, setSearchParams] = useSearchParams()
    const { notes } = useNotes()

    const keyword = searchParams.get("search") || ""

    const setKeyword = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams)

        if (value.trim()) {
            params.set("search", value)
        } else {
            params.delete("search")
        }

        setSearchParams(params, { replace: true })
    }, [])

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            if (filterType === "folder") return note.folderId === filterId
            if (filterType === "category") return note.categoryId === filterId
            if (filterType === "tag") return filterId ? note.tagIds.includes(filterId) : false

            if (keyword.trim()) {
                const words = keyword.toLowerCase().replace(/^#/, "")
                const title = note.title.toLowerCase().includes(words)
                const content = note.content.toLowerCase().includes(words)

                if (!title && !content) return false
            }

            return true
        })
    }, [keyword, notes, filterType, filterId])

    return { keyword, setKeyword, filteredNotes }
}