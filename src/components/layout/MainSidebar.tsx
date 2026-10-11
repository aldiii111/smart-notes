import * as React from "react"
import { Link, useLocation } from "react-router"
import { House, MoreVertical, Edit, FolderOpen, Tag, LayoutGrid, LucideTrash } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFolders } from "@/hooks/useFolders"
import { useCategories } from "@/hooks/useCategories"
import { useTags } from "@/hooks/useTags"

export default function MainSidebar() {
  const location = useLocation()
  const { folders, removeFolder, editFolder } = useFolders()
  const { categories, removeCategory, editCategory } = useCategories()
  const { tags, removeTag, editTag } = useTags()
  const [isView, setIsView] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [selectedType, setSelectedType] = React.useState("")
  const [editContent, setEditContent] = React.useState(null);
  const [error, setError] = React.useState(false);

  const navSections = React.useMemo(() => [
    { label: "Folders", icon: FolderOpen, items: folders },
    { label: "Tags", icon: Tag, items: tags },
    { label: "Categories", icon: LayoutGrid, items: categories },
  ], [folders, categories, tags])

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)

  const handleDel = (id: string) => {
    if (selectedType === "Folders") removeFolder(id)
    if (selectedType === "Tags") removeTag(id)
    if (selectedType === "Categories") removeCategory(id)

    setIsView(false)
  }

  const handleSave = () => {
    if (!editContent.trim()) {
      setError(true)
      return;
    }

    if (selectedType === "Folders") editFolder(selectedItem.id, { name: editContent.trim() })
    if (selectedType === "Tags") editTag(selectedItem.id, { name: editContent.trim() })
    if (selectedType === "Categories") editCategory(selectedItem.id, { name: editContent.trim() })
    setIsEditOpen(false)
    setError(false)
  }
  console.log()
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent className="justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                < SidebarMenuButton
                  isActive={isActive("/")}
                  tooltip={"Home"}
                  className="h-10 rounded-lg hover:bg-sidebar-accent/50 data-active:bg-sidebar-accent/70 group-data-[collapsible=icon]:mx-auto"
                  render={< Link to={"/"} />}
                >
                  <House />
                  <span> Home </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {navSections.map((n) => (
                <SidebarMenuItem key={n.label}>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <SidebarMenuButton
                        key={n.label}
                        tooltip={n.label}
                        className="h-10 rounded-lg hover:bg-sidebar-accent/50 data-active:bg-sidebar-accent/70 group-data-[collapsible=icon]:mx-auto"
                      >
                        <n.icon />
                        <span>{n.label}</span>
                      </SidebarMenuButton>
                    } />
                    <DropdownMenuContent >
                      <DropdownMenuGroup>
                        {n.items.length === 0 ? (
                          <DropdownMenuItem disabled>
                            Belum ada {n.label.toLowerCase()}
                          </DropdownMenuItem>
                        ) : (
                          n.items.map((nn) => (
                            <DropdownMenuItem
                              key={nn.id}
                              className={"flex justify-between"}
                            >
                              <Link to={`/${n.label.toLowerCase()}/${nn.id}`} className="w-full" >
                                {nn.name}
                              </Link>
                              <span className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(nn);
                                setSelectedType(n.label)
                                setIsView(true)
                              }}>
                                <MoreVertical className="h-4 w-4" />
                              </span>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Dialog open={isView} onOpenChange={setIsView}>
        <DialogContent className="w-[300px] sm:max-w-[300px] p-8">
          <Button variant="outline" size="sm" onClick={() => { setIsView(false); setIsEditOpen(true); setEditContent(selectedItem?.name) }} className="max-h-(--available-height)">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setIsView(false); handleDel(selectedItem.id); }} className={"max-h-(--available-height) text-red-600 focus:text-red-600 focus:bg-red-500/10"}>
            <LucideTrash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>Edit disini, dan jgn lupa save</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                placeholder="edit title"
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={error && !editContent.trim() ? "border-red-500" : ""} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="outline" type="submit" onClick={() => handleSave() }>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}