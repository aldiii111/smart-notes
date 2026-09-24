import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon, PanelRightIcon } from "lucide-react"

interface HeaderProps {
  toggleLeft: () => void
}

export default function Header({ toggleLeft }: HeaderProps) {
  const { toggleSidebar: toggleRight } = useSidebar()

  return (
    <header className="flex items-center justify-between p-2">
      <Button variant="ghost" size="icon-sm" onClick={toggleLeft}>
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={toggleRight}>
        <PanelRightIcon />
        <span className="sr-only">Toggle Chat</span>
      </Button>
    </header>
  )
}