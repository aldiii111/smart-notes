import { FileText } from "lucide-react"

interface NotesEmptyStateProps {
  message?: string
}

export default function NotesEmptyState({
  message = "Tidak ada catatan yang ditemukan."
}: NotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileText className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">Belum Ada Catatan</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
