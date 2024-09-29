const NoteApp = require('../model/noteModel'); // Adjust the path as needed

// Controller method to get notes by user
exports.getNotes = async (req, res) => {
    try {
        const user = req.query.currUser;
        const allNotes = await NoteApp.find({ user: user._id });
        res.json(allNotes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
};

// Controller method to add a new note
exports.addNote = async (req, res) => {
    try {
        const newNote = new NoteApp({
            title: req.body.title,
            content: req.body.content,
            user: req.body.currUser,
        });
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error adding note' });
    }
};

// Controller method to update an existing note
exports.updateNote = async (req, res) => {
    try {
        const { selectNote, currUser } = req.body;
        const updatedNote = await NoteApp.findByIdAndUpdate(
            { _id: req.params.id, user: currUser._id },
            selectNote,
            { new: true }
        );
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error updating note' });
    }
};

// Controller method to delete a note
exports.deleteNote = async (req, res) => {
    try {
        const { currUser } = req.body;
        const deletedNote = await NoteApp.findByIdAndDelete({
            _id: req.params.id,
            user: currUser._id,
        });
        res.json(deletedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note' });
    }
};

