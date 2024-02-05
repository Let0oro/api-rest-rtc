const express = require("express");
const server = express()
const route = express.Router();
const {
  getAllNotes,
  getNoteByID,
  editNoteByID,
  createNote,
  deleteNoteByID,
} = require("../controllers/note.controller");

route.get("/", getAllNotes);
route.get("/:id", getNoteByID);
route.put("/edit/:id", editNoteByID);
route.post("/new", createNote);
route.delete("/delete/:id", deleteNoteByID);

module.exports = route;
