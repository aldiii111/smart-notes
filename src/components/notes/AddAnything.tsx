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
import { Button } from "@/components/ui/button";
import { useFolders } from "@/hooks/useFolders";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";

function AddAnythingContent() {
    const { createFolder } = useFolders()
    const { createCategory } = useCategories()
    const { createTag } = useTags()
    const [isView, setIsView] = React.useState(false);
    const [editJudul, setEditJudul] = React.useState("");
    const [isValue, setIsValue] = React.useState("")
    const [error, setError] = React.useState(false);

    const path = ["folders", "categories", "tags"]

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!editJudul.trim() || !isValue) {
            setError(true)
            return;
        }

        if (isValue === "folders") createFolder({ name: editJudul });
        if (isValue === "categories") createCategory({ name: editJudul });
        if (isValue === "tags") createTag({ name: editJudul });

        setIsView(false);
        setError(false);
    }

    return (
        <Dialog open={isView} onOpenChange={(open) => {
            setIsView(open);
            if (!open) {
                setEditJudul("");
                setIsValue("");
                setError(false);
            }
        }}>
            <DialogTrigger
                render={
                    <Button size="sm">
                        <Plus className="mr-1.5 h-4 w-4" />
                        Filter
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
                                value={editJudul}
                                onChange={(e) => setEditJudul(e.target.value)}
                                className={
                                    error && !editJudul.trim()
                                        ? "border-destructive focus-visible:ring-destructive/20 text-warp break-all"
                                        : ""
                                }
                            />
                            {error && !editJudul.trim() && (
                                <span className="text-xs text-destructive">
                                    Judul tidak boleh kosong
                                </span>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Judul</FieldLabel>
                            <select
                                value={isValue}
                                onChange={(e) => setIsValue(e.target.value)}
                                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                            >
                                <option
                                    value=""
                                    className="bg-popover text-popover-foreground"
                                >
                                    Select Filter
                                </option>
                                {path.map((path) => (
                                    <option
                                        key={path}
                                        value={path}
                                        className="bg-popover text-popover-foreground"
                                    >
                                        {path}
                                    </option>
                                ))}
                            </select>
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