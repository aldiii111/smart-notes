import Sidebar from "./Sidebar"
import ChatSidebar from "../chat/ChatSidebar"
import Header from "./Header"
import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarInset,
} from "../ui/sidebar"

export default function AppLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main>
          <Outlet />
        </main>
      </SidebarInset>
      <ChatSidebar />
    </SidebarProvider>
  )
}