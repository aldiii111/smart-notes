import * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
import SearchBar from "./SearchBar";
import NoteForm from "@/components/notes/NoteForm";
import { useLocation } from "react-router";
import { useParams } from "react-router";

interface HeaderProps {
  toggleLeft: () => void;
  defaultFolderId?: string | null;
  defaultCategoryId?: string;
  defaultTagId?: string[];
}

export default function Header({
  toggleLeft,
  defaultFolderId = "",
  defaultCategoryId = "",
  defaultTagId = [],
}: HeaderProps) {
  const [folder, setFolder] = React.useState(defaultFolderId);
  const [category, setCategory] = React.useState("");
  const [tag, setTag] = React.useState([]);
  const { toggleSidebar: toggleRight } = useSidebar();
  let location = useLocation();
  let { id } = useParams();

  React.useEffect(() => {
    if (location.pathname.startsWith("/folder")) {
      setFolder(id);
    }
  }, [location.pathname, id]);

  console.log(folder);

  return (
    <header className="flex items-center justify-between gap-2 p-2">
      <Button variant="ghost" size="icon-sm" onClick={toggleLeft}>
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex flex-col gap-5 items-center sm:flex-row sm:gap-10">
        <SearchBar />

        <NoteForm />
      </div>

      <Button variant="ghost" size="icon-sm" onClick={toggleRight}>
        <PanelRightIcon />
        <span className="sr-only">Toggle Chat</span>
      </Button>
    </header>
  );
}
