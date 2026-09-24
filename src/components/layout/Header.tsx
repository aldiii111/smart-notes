import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PanelRightIcon } from "lucide-react"

export default function Header({ onClick }: React.ComponentProps<typeof Button>) {
    const { onToggleRight } = useSidebar()

    return (
        <header className="flex items-center justify-between p-2">
            <SidebarTrigger />
            <Button variant="ghost" size="icon-sm" onClick={(event) => {
                onClick?.(event)
                onToggleRight()
            }}>
                <PanelRightIcon />
                <span className="sr-only">Toggle Chat</span>
            </Button>
        </header>
    )
}