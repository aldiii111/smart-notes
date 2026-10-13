import { Search, X } from "lucide-react"
import { useSearch } from "@/hooks/useSearch"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const { keyword, setKeyword } = useSearch()

  return (
    <div className="relative flex flex-1 items-center max-w-sm">
      <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder="Cari catatan..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="h-8 w-full rounded-lg border border-input bg-transparent pl-8 pr-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors dark:bg-input/30"
      />
      {keyword && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setKeyword("")}
          className="absolute right-1 h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Hapus pencarian</span>
        </Button>
      )}
    </div>
  )
}
