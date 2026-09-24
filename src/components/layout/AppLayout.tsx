import MainSidebar from "./MainSidebar"
import ChatSidebar from "@/components/chat/ChatSidebar"
import Header from "./Header"
import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "../ui/sidebar"

function InnerLayout() {
  const { toggleSidebar: toggleLeft } = useSidebar()

  return (
    <SidebarProvider defaultOpen={false} className="flex-1 min-h-0 m-2">
      <SidebarInset className="md:rounded-xl">
        <Header toggleLeft={toggleLeft} />
        <Outlet />
      </SidebarInset>

      <ChatSidebar />
    </SidebarProvider>
  )
}

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <MainSidebar />
      <InnerLayout />
    </SidebarProvider>
  )
}