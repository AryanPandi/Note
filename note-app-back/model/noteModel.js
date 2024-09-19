const mongoose = require("mongoose");

const NoteUser = require("./noteUser");
const noteAppSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: NoteUser,
    required : true,
    index : true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NoteModel = mongoose.model("Note", noteAppSchema);

module.exports = NoteModel;
