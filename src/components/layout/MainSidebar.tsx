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
  { label: "Home",       icon: House,       to: "/"           },
  { label: "Folders",    icon: FolderOpen,  to: "/folders"    },
  { label: "Tags",       icon: Tag,         to: "/tags"       },
  { label: "Categories", icon: LayoutGrid,  to: "/categories" },
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
              {navItems.map(({ label, icon: Icon, to }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    isActive={isActive(to)}
                    tooltip={label}
                    className="h-10 rounded-lg hover:bg-sidebar-accent/50 data-active:bg-sidebar-accent/70 group-data-[collapsible=icon]:mx-auto"
                    render={<NavLink to={to} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}