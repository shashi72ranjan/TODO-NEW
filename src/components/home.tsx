"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea"; 
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Note = {
  id: string;
  heading: string;
  document: string;
  completed: boolean;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const parseContent = (text: string) => {
    const [heading, ...docParts] = text.trim().split("\n");
    const document = docParts.join("\n").trim();
    return { heading: heading.trim(), document };
  };

  const handleSubmit = () => {
    const { heading, document } = parseContent(content);

    if (!heading || !document) {
      setWarning("⚠️ First line should be heading, rest is the document.");
      return;
    }

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId ? { ...n, heading, document } : n
        )
      );
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        heading,
        document,
        completed: false,
      };
      setNotes((prev) => [...prev, newNote]);
    }

    setContent("");
    setWarning("");
  };

  const handleEdit = (id: string, currentHeading: string, currentDoc: string) => {
    setContent(`${currentHeading}\n${currentDoc}`);
    setEditingId(id);
    setWarning("");
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const { heading, document } = parseContent(content);
  const isFormValid = heading !== "" && document !== "";

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Form */}
      <div className="space-y-2">
        <Textarea
          placeholder="heading
            document"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        {warning && <p className="text-red-600">{warning}</p>}
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
            <h2 className="font-semibold">{note.heading}</h2>
            <p>{note.document}</p>
            <div className="flex gap-2 mt-2">
              <Button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(note.id, note.heading, note.document)}
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