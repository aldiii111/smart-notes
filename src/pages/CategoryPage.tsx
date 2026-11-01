import * as React from "react";
import { useNavigate } from "react-router";
import { useSearch } from "@/hooks/useSearch";
import { useNotes } from "@/hooks/useNotes";
import NoteList from "@/components/notes/NoteList";

function CategoryPage() {
  const { filteredNotes } = useSearch("category");
  const navigate = useNavigate()
  const { notes } = useNotes()

  const handleClick = (id: string) => {
    const notee = notes.find((n) => n.id === id)
    navigate(`/notes/${notee?.id}`)
  }

  return (
    <div className="flex flex-1 flex-col p-10">
      <NoteList
      notes={filteredNotes}
      onNoteClick={handleClick}
      />
    </div>
  );
}

export default CategoryPage;
