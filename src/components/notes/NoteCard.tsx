import type { Note } from "@/types/note"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface NoteCardProps {
  note: Note
  onClick?: (id: string) => void
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <Card
      onClick={() => onClick?.(note.id)}
      className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
    >
      <CardHeader>
        <CardTitle className="line-clamp-1">{note.title || "Tanpa Judul"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.content || "Tidak ada konten..."}
        </p>
      </CardContent>
    </Card>
  )
}
