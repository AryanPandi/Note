import React, { useState } from 'react';
import axios from 'axios';
import '../note.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io('http://localhost:3001');


const UpdateButton = ({ isModalOpen, setIsModalOpen, handleOpenModal, handleCloseModal, handleCancel, note, setNote, currUser, notes, setNotes, selectNote, setSelectNote }) => {
  const navigate = useNavigate();
  const HandleUpdateNote = (e, noteId) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/n/updateNote/${noteId}`, { selectNote: selectNote, currUser: currUser }, { withCredentials: true })
      .then((res) => {
        if (res.data.isAuth) {
          const newNotes = notes.map((n) => {
            if (n._id === noteId) {
              return res.data.updatedNote;
            }
            return n;
          });


          setNotes(newNotes);
          setNote({ title: '', content: '' });
          setSelectNote(null);
        } else {
          localStorage.removeItem('currUser', null);
          navigate('/login');
        }
      })
      .catch((err) => {
        console.log(err);
        navigate('/login');
      });
  }


  return (
    <div className='edit-btn' >
      <Modal isOpen={isModalOpen} onClose={(e) => handleCloseModal(e)} setSelectNote={setSelectNote} HandleUpdateNote={HandleUpdateNote} handleCancel={handleCancel} selectNote={selectNote} />
    </div>
  )
};


const Modal = ({ isOpen, onClose, HandleUpdateNote, handleCancel, selectNote, setSelectNote }) => {
  if (!isOpen) return null;
  return (
    <form className="note-form" onSubmit={(e) => HandleUpdateNote(e, selectNote._id)}>
      <div style={modalStyles.overlay}>
        <div style={modalStyles.modal}>
          <button style={modalStyles.closeButton} onClick={handleCancel}>X</button>
          <h2>Add a Note</h2>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={selectNote.title}
              onChange={(e) => setSelectNote({ ...selectNote, title: e.target.value })}
              required
              style={modalStyles.input}
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              type="text"
              value={selectNote.content}
              onChange={(e) => setSelectNote({ ...selectNote, content: e.target.value })}
              required
              style={modalStyles.textarea}
            />
          </div>
          <div style={modalStyles.buttonContainer}>
            <button onClick={(e) => handleCancel(e)}>Cancel</button>
            <button type='submit'>Save</button>
            {/* <button type="submit">Save Note</button> */}
          </div>
        </div>
      </div>
    </form>
  );
};


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
    display: 'flex',
    justifyContent: 'space-evenly'
  },
};


export default UpdateButton;