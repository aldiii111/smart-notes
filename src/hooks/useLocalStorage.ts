import type { Note } from "@/types/note";
import type { Tag } from "@/types/tag";
import type { Folder } from "@/types/folder";
import type { Category } from "@/types/category";

const STORAGE_KEYS = {
  notes: 'kb_notes',
  folders: 'kb_folders',
  categories: 'kb_categories',
  tags: 'kb_tags',
}

export function getNotes(): Note[] {
    const raw = localStorage.getItem(STORAGE_KEYS.notes)
    return raw ? JSON.parse(raw) : []
}

export function saveNotes(note: Note[]): void {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(note))
}

export function getFolders(): Folder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.folders)
    return raw ? JSON.parse(raw) : []
}

export function saveFolders(folder: Folder[]): void {
    localStorage.setItem(STORAGE_KEYS.folders, JSON.stringify(folder))
}

export function getCategories(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEYS.categories)
    return raw ? JSON.parse(raw) : []
}

export function saveCategories(category: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(category))
}

export function getTags(): Tag[] {
    const raw = localStorage.getItem(STORAGE_KEYS.tags)
    return raw ? JSON.parse(raw) : []
}

export function saveTags(tag: Tag[]): void {
    localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(tag))
}