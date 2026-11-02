import * as React from "react";
import { Plus, ScissorsSquareDashedBottom } from "lucide-react";
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
import { useFolders } from "@/hooks/useFolders";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { useLocation } from "react-router";

function AddAnythingContent() {
    const { createFolder } = useFolders()
    const { createCategory } = useCategories()
    const { createTag } = useTags()
    let location = useLocation()
    const [editTitle, setEditTitle] = React.useState("");
    const [error, setError] = React.useState(false);

    const path = ["/folders", "/categories/", "/tags/"]

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!editTitle.trim()) {
            setError(true)
            return;
        }
        const pathd = path.includes(location.pathname)
        console.log(pathd)
    }

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button size="sm">
                        <Plus className="mr-1.5 h-4 w-4" />
                        Catatan Baru
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Baru dgn mengisi input dibawah ini</DialogTitle>
                    <DialogDescription>
                        Tulis judul. Untuk menambahkan nya
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave}>
                    <FieldGroup>
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
                    </FieldGroup>
                    <DialogFooter className="mt-2">
                        <DialogClose render={<Button variant="outline" type="button" />}>
                            Batal
                        </DialogClose>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddAnythingContent;