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

    }, [])

    return { keyword, setKeyword, filteredNotes }
}