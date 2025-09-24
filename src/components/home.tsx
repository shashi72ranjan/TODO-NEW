"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Note = {
  id: string;
  document: string;
  completed: boolean;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = () => {
    const document = content.trim();
    if (!document) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) => (n.id === editingId ? { ...n, document } : n))
      );
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        document,
        completed: false,
      };
      setNotes((prev) => [...prev, newNote]);
    }

    setContent("");
  };

  const handleEdit = (id: string, currentDoc: string) => {
    setContent(currentDoc);
    setEditingId(id);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const isFormValid = content.trim() !== "";

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Form */}
      <div className="space-y-2">
        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <Button
          variant="destructive"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
        >
          {editingId ? "Update Note" : "Add Note"}
        </Button>
      </div>

      {/* Notes List */}
      <ul className="space-y-3">
        {notes.map((note) => (
          <li
            key={note.id}
            className={`p-4 border rounded shadow-sm ${
              note.completed ? "bg-black" : "bg-amber-600"
            }`}
          >
            <p>{note.document}</p>
            <div className="flex gap-2 mt-2">
              <Button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(note.id, note.document)}
              >
                <Pencil />
              </Button>
              <Button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(note.id)}
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}