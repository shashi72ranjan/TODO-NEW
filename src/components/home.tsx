"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react";


type Note = {
  id: string;
  heading: string;
  document: string;
  completed: boolean;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [heading, setHeading] = useState("");
  const [document, setDocument] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [warning, setWarning] = useState("");

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = () => {
    if (!heading.trim() || !document.trim()) {
      setWarning("⚠️ Both heading and document are required!");
      return;
    }

    if (editingId) {
      // Update note
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId ? { ...n, heading, document } : n
        )
      );
      setEditingId(null);
    } else {
      // Add new note
      const newNote: Note = {
        id: Date.now().toString(),
        heading,
        document,
        completed: false,
      };
      setNotes((prev) => [...prev, newNote]);
    }

    // Reset fields
    setHeading("");
    setDocument("");
    setWarning("");
  };

  const handleEdit = (id: string, currentHeading: string, currentDoc: string) => {
    setHeading(currentHeading);
    setDocument(currentDoc);
    setEditingId(id);
    setWarning("");
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  

  const isFormValid = heading.trim() !== "" && document.trim() !== "";

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold group cursor-pointer inline-block"> <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">MY TODO</span></h1>

      {/* Form */}
      <div className="space-y-2">
        <Input  type="text"
         placeholder="Heading"
           value={heading}
          onChange={(e) => setHeading(e.target.value)}
 />
        <Input
          className="border p-2 rounded w-full"
          placeholder="Document"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
        />

        {warning && <p className="text-red-600">{warning}</p>}

        {isFormValid && (
          <Button variant="destructive" 
           onClick={handleSubmit}
>           {editingId ? "Update Note" : "Add Note"}
             </Button>
        )}
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
                <Pencil/>
              </Button>
              <Button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(note.id)}
              >
                <Trash2/>
              </Button>
              
              
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
