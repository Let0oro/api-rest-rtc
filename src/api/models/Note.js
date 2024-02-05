const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String}, 
        mood: {type: String, required: true}, 
        collection: {type: String}, 
        genre: {type: String, required: true}, 
        positiveRate: {type: Number, required: true}
    }, 
    {
        timestamps: true
    }
)

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;