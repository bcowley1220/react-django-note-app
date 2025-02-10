import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Function to register a user
export const registerUser = async (username, password) => {
  try {
    return await api.post("register/", { username, password });
  } catch (error) {
    throw error.response?.data?.error || "Registration failed. Try again.";
  }
};

// Function to log in a user
export const loginUser = async (username, password) => {
  try {
    const response = await api.post("token/", { username, password });

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Login failed. Check credentials.";
  }
};

// Function to fetch notes
export const fetchNotes = async () => {
  try {
    const token = localStorage.getItem("access");
    const response = await api.get("notes/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw "Failed to fetch notes. Please try again.";
  }
};

// Function to create a note
export const createNote = async (title, content) => {
  try {
    const token = localStorage.getItem("access");
    const response = await api.post(
      "notes/",
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw "Failed to create note. Ensure all fields are filled.";
  }
};

// Function to update a note
export const updateNote = async (id, title, content) => {
  try {
    const token = localStorage.getItem("access");
    const response = await api.put(
      `notes/${id}/`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw "Failed to update note. Try again.";
  }
};

// Function to delete a note
export const deleteNote = async (id) => {
  try {
    const token = localStorage.getItem("access");
    await api.delete(`notes/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    throw "Failed to delete note.";
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
