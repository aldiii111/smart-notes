import { useState } from "react"
import MainSidebar from "./MainSidebar"
import ChatSidebar from "../chat/ChatSidebar"
import Header from "./Header"
import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarInset,
} from "../ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet"
import { cn } from "cn"

export default function AppLayout() {
  const [rightOpen, setRightOpen] = useState(false)
  const isMobile = useIsMobile()

  const toggleRight = () => setRightOpen((prev) => !prev)

  return (
    <SidebarProvider defaultOpen={true}>
      <MainSidebar />

      <SidebarInset className="md:rounded-xl">
        <Header onToggleRight={toggleRight} />
        <Outlet />
      </SidebarInset>

      {/* Right Chat Panel — custom, bukan shadcn Sidebar */}
      {isMobile ? (
        <Sheet open={rightOpen} onOpenChange={setRightOpen}>
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="">
              <SheetTitle>AI Chat</SheetTitle>
              <SheetDescription>AI Chat Assistant</SheetDescription>
            </SheetHeader>
            <ChatSidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <aside
          className={cn(
            "h-svh bg-sidebar overflow-hidden transition-[width] duration-200 ease-linear",
            rightOpen ? "w-[25rem]" : "w-0"
          )}
        >
          <div className="h-full w-[25rem]">
            <ChatSidebar />
          </div>
        </aside>
      )}
    </SidebarProvider>
  )
}