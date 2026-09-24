import MainSidebar from "./MainSidebar"
import ChatSidebar from "@/components/chat/ChatSidebar"
import { useState } from "react"
import Header from "./Header"
import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarInset,
} from "../ui/sidebar"

export default function AppLayout() {

  return (
    <SidebarProvider defaultOpen={true}>
      <MainSidebar />

      <SidebarInset className="md:rounded-xl">
        <Header />
        <Outlet />
      </SidebarInset>

      <ChatSidebar />
    </SidebarProvider>
  )
}