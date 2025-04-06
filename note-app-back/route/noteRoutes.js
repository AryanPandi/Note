const express = require('express');
const noteRouters = express.Router();
const checkAuth = require('../middleware/userMiddleware'); // The admin check middleware
const { getNotes, addNote, updateNote, deleteNote } = require('../controllers/noteController'); // Adjust path as needed

// Note routes mapped to controller methods
noteRouters.get('/getNote', checkAuth, getNotes);
noteRouters.post('/addNote', checkAuth, addNote);
noteRouters.put('/updateNote/:id', checkAuth, updateNote);
noteRouters.delete('/deleteNote/:id', checkAuth, deleteNote);

module.exports = noteRouters;