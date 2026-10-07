import { NavLink, useLocation } from "react-router"
import { House, FolderOpen, Tag, LayoutGrid } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { label: "Folders",    icon: FolderOpen, idx: 0 },
  { label: "Tags",       icon: Tag,        idx: 1 },
  { label: "Categories", icon: LayoutGrid, idx: 2 },
]

export default function MainSidebar() {
  const location = useLocation()

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent className="justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/")}
                    tooltip={"Home"}
                    className="h-10 rounded-lg hover:bg-sidebar-accent/50 data-active:bg-sidebar-accent/70 group-data-[collapsible=icon]:mx-auto"
                    render={<NavLink to={"/"} />}
                  >
                    <House />
                    <span>Home</span>
                  </SidebarMenuButton>
                  
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}