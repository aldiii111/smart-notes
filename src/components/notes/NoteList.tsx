import type { Note } from "@/types/note"
import NoteCard from "./NoteCard"
import NotesEmptyState from "./NotesEmptyState"

interface NoteListProps {
  notes: Note[]
  onNoteClick?: (id: string) => void
}

export default function NoteList({ notes, onNoteClick }: NoteListProps) {
  if (notes.length === 0) {
    return <NotesEmptyState />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onClick={onNoteClick} />
      ))}
    </div>
  )
}
