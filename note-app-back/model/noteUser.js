const mongoose=require('mongoose');

const noteAppUserSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

const NoteUser= mongoose.model('User',noteAppUserSchema);

module.exports= NoteUser;