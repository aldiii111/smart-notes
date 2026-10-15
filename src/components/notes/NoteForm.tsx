import * as React from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { useFolders } from "@/hooks/useFolders";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { useLocation } from "react-router";
import { useParams } from "react-router";
import { cn } from "cn";

interface NoteFormProps {
  defaultFolderId?: string;
  defaultCategoryId?: string;
  defaultTagId?: string[];
  trigger?: React.ReactElement;
}

export default function NoteForm({
  defaultFolderId = "",
  defaultCategoryId = "",
  defaultTagId = [],
  trigger,
}: NoteFormProps) {
  const { createNote } = useNotes();
  const { folders } = useFolders();
  const { categories } = useCategories();
  const { tags } = useTags();

  const [isView, setIsView] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState("");
  const [editContent, setEditContent] = React.useState("");
  const [selectedFolder, setSelectedFolder] = React.useState<string | undefined>(defaultFolderId);
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(defaultCategoryId);
  const [selectedTag, setSelectedTag] = React.useState<string[]>(defaultTagId);

  let location = useLocation();
  let { id } = useParams();

  React.useEffect(() => {
    if (location.pathname.startsWith("/folder")) {
      setSelectedFolder(id);
    }
    if(location.pathname.startsWith("/categories")) {
      selectedCategory(id)
    }
  }, [location.pathname, id]);

  const handleToggleTag = (tagId: string) => {
    setSelectedTag((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      setError(true);
      return;
    }

    createNote({
      title: editTitle.trim(),
      content: editContent.trim(),
      folderId: selectedFolder ? selectedFolder.trim() : null,
      categoryId: selectedCategory ? selectedCategory.trim() : null,
      tagIds: selectedTag,
    });

    setIsView(false);
    setError(false);
  };

  return (
    <Dialog
      open={isView}
      onOpenChange={(open) => {
        setIsView(open);
        if (open) {
          setEditTitle("");
          setEditContent("");
          // setSelectedFolder(defaultFolderId);
          // setSelectedCategory(defaultCategoryId);
          // setSelectedTag(defaultTagId);
          setError(false);
        }
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Catatan Baru
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Catatan Baru</DialogTitle>
          <DialogDescription>
            Tulis judul dan isi catatan. Kamu juga bisa memilih folder,
            kategori, dan tag.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FieldGroup className="gap-3.5">
            <Field>
              <FieldLabel>Judul</FieldLabel>
              <Input
                placeholder="Judul catatan..."
                maxLength={200}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={
                  error && !editTitle.trim()
                    ? "border-destructive focus-visible:ring-destructive/20 text-warp break-all"
                    : ""
                }
              />
              {error && !editTitle.trim() && (
                <span className="text-xs text-destructive">
                  Judul tidak boleh kosong
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel>Isi Catatan</FieldLabel>
              <Textarea
                placeholder="Tuliskan isi catatanmu di sini..."
                maxLength={5000}
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={
                  error && !editContent.trim()
                    ? "border-destructive focus-visible:ring-destructive/20 text-warp break-all"
                    : ""
                }
              />
              {error && !editContent.trim() && (
                <span className="text-xs text-destructive">
                  Isi catatan tidak boleh kosong
                </span>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel>Folder</FieldLabel>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option
                    value=""
                    className="bg-popover text-popover-foreground"
                  >
                    Tanpa Folder
                  </option>
                  {folders.map((folder) => (
                    <option
                      key={folder.id}
                      value={folder.id}
                      className="bg-popover text-popover-foreground"
                    >
                      {folder.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel>Kategori</FieldLabel>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option
                    value=""
                    className="bg-popover text-popover-foreground"
                  >
                    Tanpa Kategori
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-popover text-popover-foreground"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Tags</FieldLabel>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {tags.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada tag yang dibuat.
                  </p>
                ) : (
                  tags.map((tag) => {
                    const isSelected = selectedTag.includes(tag.id);
                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => handleToggleTag(tag.id)}
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer border",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground",
                        )}
                      >
                        #{tag.name}
                      </button>
                    );
                  })
                )}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-2">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit">Simpan Catatan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
