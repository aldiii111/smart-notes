import * as React from "react"
import { useNotes } from "@/hooks/useNotes"
import { useFolders } from "@/hooks/useFolders"
import { useCategories } from "@/hooks/useCategories"
import { useTags } from "@/hooks/useTags"

export default function NoteForm() {
  const { notes, createNote } = useNotes()
  const { folders } = useFolders()
  const { categories } = useCategories()
  const { tags } = useTags()
  const [isView, setIsView] = React.useState(false)
  const [error, setError] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState("")
  const [editContent, setEditContent] = React.useState("")
  const [selectedFolder, setSelectedFolder] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("")
  const [selectedTag, setSelectedTag] = React.useState<string[]>([])

  const handleSave = () => {
    if(!editTitle.trim() || !editContent.trim()) {
      setError(true)
      return;
    }
    createNote({
      title: editTitle.trim(),
      content: editContent.trim(),
      folderId: selectedFolder.trim(),
      categoryId: selectedCategory.trim(),
      tagIds: selectedTag
    })
    setIsView(false)
    setError(false)
  } 

  return <div>NoteForm</div>;
}
