import React, { useEffect, useState } from "react";
import { fetchNotes, createNote, updateNote, deleteNote, logout } from "../api";
import { useNavigate } from "react-router-dom";

const Notes = ({ setIsAuthenticated }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const getNotes = async () => {
      try {
        setLoading(true);
        const data = await fetchNotes();
        setNotes(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, [navigate]);

  const handleCreateOrUpdateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        const updatedNote = await updateNote(editingId, title, content);
        setNotes(notes.map((note) => (note.id === editingId ? updatedNote : note)));
        setEditingId(null);
      } else {
        const newNote = await createNote(title, content);
        setNotes([...notes, newNote]);
      }
      setTitle("");
      setContent("");
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return; // ✅ Stop if user cancels
  
    try {
      setLoading(true);
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setError("Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>Your Notes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <form onSubmit={handleCreateOrUpdateNote}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Note" : "Add Note"}
        </button>
        {editingId && <button onClick={() => setEditingId(null)}>Cancel Edit</button>}
      </form>

      {loading && <p>Loading notes...</p>}
      {notes.length === 0 && !loading && <p>No notes found.</p>}

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
