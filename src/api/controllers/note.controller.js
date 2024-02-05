const Note = require('../models/Note');

const getAllNotes = async(req, res, next) => {
    try {
        const notes = await Note.find();
        return res.status(200).json(notes);
    } catch (err) {
        return next(err)
    }
}
const getNoteByID = async(req, res, next) => {
        const { id } = req.params;
    try {
        const note = await Note.findById(id);
        return res.status(200).json(note);
    } catch (err) {
        return next(err)
    }
}
const editNoteByID = async(req, res, next) => {
    const { id } = req.params;
    try {
        const noteModify = new Note(req.body);
        noteModify._id = id;
        const noteUpdated = await Note.findByIdAndUpdate(id, noteModify);
        return res.status(200).json('The note has been updated: ' + noteUpdated);
    } catch (err) {
        return next(err)
    }
}
const createNote = async(req, res, next) => {
    try {
        const newNote = await Note.create({
            title: req.body.title,
            content: req.body.content,
            mood: req.body.mood,
            collection: req.body.collection,
            genre: req.body.genre,
            positiveRate: req.body.positiveRate,
        });
        const createdNote = await newNote.save();
        return res.status(201).json('The note has been created: ' + createdNote)
    } catch (err) {
        return next(err)
    }
}
const deleteNoteByID = async(req, res, next) => {
    const { id } = req.params;
    try {
        await Note.findByIdAndDelete(id);
        return res.status(200).json('The note has been deleted');
    } catch (err) {
        return next(err)
    }
}

module.exports = { 
    getAllNotes,
    getNoteByID,
    editNoteByID,
    createNote,
    deleteNoteByID,
}