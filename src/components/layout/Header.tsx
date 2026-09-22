import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PanelRightIcon } from "lucide-react"

interface HeaderProps {
    onToggleRight: () => void
}

export default function Header({ onToggleRight }: HeaderProps) {
    return (
        <header className="flex items-center justify-between p-2">
            <SidebarTrigger />
            <Button variant="ghost" size="icon-sm" onClick={onToggleRight}>
                <PanelRightIcon />
                <span className="sr-only">Toggle Chat</span>
            </Button>
        </header>
    )
}