import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../note.css';
import io from 'socket.io-client'
const socket = io('http://localhost:3001');



const AddButton = ({ note, setNote, currUser, notes, setNotes }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  }


  const handleCloseModal = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  }
  const HandleAddNote = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/n/addNote', { title: note.title, content: note.content, currUser: currUser }, { withCredentials: true })
      .then((res) => {
        if (res.data.isAuth) {
          setNotes([...notes, res.data.savedNote])
          setNote({ title: "", content: "" });
          handleCloseModal(e);
        } else {
          localStorage.removeItem('currUser', null);
          navigate('/login');
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem('currUser', null);
        navigate('/login');
      });
  };
  return (
    <div className="note-form">
      <button type='submit' onClick={(e) => handleOpenModal(e)} >Add Note</button>
      <Modal isOpen={isModalOpen} onClose={(e) => handleCloseModal(e)} HandleAddNote={HandleAddNote} note={note} setNote={setNote} />
    </div>
  );
};
const Modal = ({ isOpen, onClose, HandleAddNote, note, setNote }) => {
  if (!isOpen) return null;
  return (
    <form className="note-form" onSubmit={(e) => HandleAddNote(e)}>
      <div style={modalStyles.overlay}>
        <div style={modalStyles.modal}>
          <button style={modalStyles.closeButton} onClick={onClose}>X</button>
          <h2>Add a Note</h2>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              required
              style={modalStyles.input}
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              type="text"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              required
              style={modalStyles.textarea}
            />
          </div>
          <div style={modalStyles.buttonContainer}>
            <button type="submit">Save Note</button>
          </div>
        </div>
      </div>
    </form>
  );
};
// Modal Styles
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    height: '150px',
  },
  buttonContainer: {
    textAlign: 'right',
  },
};


export default AddButton;