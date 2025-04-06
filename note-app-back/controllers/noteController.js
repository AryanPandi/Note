const NoteApp = require('../model/noteModel');


// Controller method to get notes by user
exports.getNotes = async (req, res) => {
    try {
        const user = req.query.currUser;
        const allNotes = await NoteApp.find({ user: user._id });
        res.json({ allNotes, isAuth: true });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
};


// Controller method to add a new note
exports.addNote = async (req, res) => {
    try {
        const io = req.app.get('io');
        const newNote = new NoteApp({
            title: req.body.title,
            content: req.body.content,
            user: req.body.currUser,
        });
        const savedNote = await newNote.save();
        io.to(req.body.currUser._id).emit('noteAddition', savedNote);
        res.json({ savedNote, isAuth: true });
    } catch (error) {
        res.status(500).json({ error: 'Error adding note' });
    }
};


// Controller method to update an existing note
exports.updateNote = async (req, res) => {
    try {
        const io = req.app.get('io');
        const { selectNote, currUser } = req.body;
        const updatedNote = await NoteApp.findByIdAndUpdate(
            { _id: req.params.id, user: currUser._id },
            selectNote,
            { new: true }
        );
        io.to(currUser._id).emit('noteUpdation', updatedNote);
        res.json({ updatedNote, isAuth: true });
    } catch (error) {
        res.status(500).json({ error: 'Error updating note ' + error });
    }
};


// Controller method to delete a note
exports.deleteNote = async (req, res) => {
    try {
        const io = req.app.get('io');
        const { currUser } = req.body;
        const deletedNote = await NoteApp.findByIdAndDelete({
            _id: req.params.id,
            user: currUser._id,
        });
        io.to(currUser._id).emit('noteDeletion', req.params.id);
        res.json({ deletedNote, isAuth: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note' });
    }
};


