import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon, PanelRightIcon } from "lucide-react"
import SearchBar from "./SearchBar"
import NoteForm from "@/components/notes/NoteForm"

interface HeaderProps {
  toggleLeft: () => void
}

export default function Header({ toggleLeft }: HeaderProps) {
  const { toggleSidebar: toggleRight } = useSidebar()

  return (
    <header className="flex items-center justify-between gap-2 p-2">
      <Button variant="ghost" size="icon-sm" onClick={toggleLeft}>
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex gap-10 items-center">
        <SearchBar />

        <NoteForm />
      </div>

      <Button variant="ghost" size="icon-sm" onClick={toggleRight}>
        <PanelRightIcon />
        <span className="sr-only">Toggle Chat</span>
      </Button>
    </header>
  )
}