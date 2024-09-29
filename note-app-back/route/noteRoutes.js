const express = require('express');
const noteRouters = express.Router();
const {getNotes,addNote,updateNote,deleteNote} = require('../controllers/noteController'); // Adjust path as needed

// Note routes mapped to controller methods
noteRouters.get('/getNote', getNotes);
noteRouters.post('/addNote', addNote);
noteRouters.put('/updateNote/:id', updateNote);
noteRouters.delete('/deleteNote/:id', deleteNote);

module.exports = noteRouters;
