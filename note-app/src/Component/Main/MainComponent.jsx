import { useState, useEffect, } from 'react';
import axios from 'axios';
import '../note.css';
import AddButton from '../Button/AddButton';
import UpdateButton from '../Button/UpdateButton';
import NoteItem from '../NoteComponent/NoteItem';
import { useNavigate } from 'react-router-dom';

const MainComponent = ({ currUser, setCurrUser }) => {
  const [note, setNote] = useState({
    id: 0,
    title: "",
    content: "",
  });
  const [notes, setNotes] = useState([]);
  const [selectNote, setSelectNote] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
    const storedUser = localStorage.getItem('currUser');
  if (storedUser) {
    setCurrUser(JSON.parse(storedUser));
  } else {
    navigate('/login');
  }
  },[]);

  useEffect(() => {
    if (currUser) { 
      axios.get('http://localhost:3001/getNote', { params: { currUser: currUser } }) 
        .then(res => {
          setNotes(res.data);
        })
        .catch(err => console.log(err));
    }
  },[currUser]);


  const HandleAddNote=(e)=>{
    e.preventDefault();
    axios.post('http://localhost:3001/addNote',{title:note.title,content:note.content,currUser:currUser})
    .then((res)=>{ 
      setNotes([...notes,res.data])
      setNote({ title: "", content: "" });
    })
    .catch(err=> console.log(err));
  };

  const HandleUpdateNote = (e, noteId) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/updateNote/${noteId}`, {selectNote:selectNote,currUser:currUser})
      .then(() => {
        const newNotes = notes.map((n) => {
          if (n._id === noteId) {
            return selectNote;
          }
          return n;
        });

        setNotes(newNotes);
        setNote({ title: '', content: '' });
        setSelectNote(null);
      })
      .catch(err => console.log(err));
  }

  // const handleUpdateNote = (e) => {
  //   e.preventDefault();
  //   if (!selectNote) {
  //     return;
  //   }
  //   const updatedNote = {
  //     id: selectNote.id,
  //     title: selectNote.title,
  //     content: selectNote.content
  //   };
  //   const updateNote = notes.map((note) => note.id === selectNote.id ? updatedNote : note);
  //   setSelectNote(null);
  //   setNotes(updateNote);
  //   setNote({ title: "", content: "" });
  // };
  const handleCancel = (e) => {
    e.preventDefault();
    setNote({ title: "", content: "" });
    setSelectNote(null);
  }


  const HandleDeleteNote = (e, notedId) => {
    axios.delete(`http://localhost:3001/deleteNote/n/${notedId}`,{data:{currUser:currUser}})
      .then(() => {
        setNotes(note => {
          return note.filter(n => {
            return n._id !== notedId;
          })
        });
      })
      .catch(err => console.log(err));
  };  

  const HandleLogout = () => {
    setCurrUser(null);
    localStorage.removeItem('currUser');
    navigate('/login');
  }


  return (
    <>
      <div className="app-header">
          {currUser
            ?
            <div className="user-card">
              <span>{currUser.username}</span>
            </div>
            :
            <></>
          }
        
        <button className="logout-btn" onClick={HandleLogout}>Logout</button>
      </div>

      <div className="app-container">
          <form className="note-form" onSubmit={(e) => selectNote ? HandleUpdateNote(e, selectNote._id) : HandleAddNote(e)}>
            <input type='text' placeholder="Title" value={selectNote ? selectNote.title : note.title} onChange={(e) => selectNote ? setSelectNote({ ...selectNote, title: e.target.value }) : setNote({ ...note, title: e.target.value })}></input>
            <textarea type='text' placeholder="Content" value={selectNote ? selectNote.content : note.content} onChange={(e) => selectNote ? setSelectNote({ ...selectNote, content: e.target.value }) : setNote({ ...note, content: e.target.value })} rows={15}></textarea>
            {selectNote != null ? (
              <UpdateButton handleCancel={handleCancel} />
            )
              : (
                <AddButton />
              )
            }
          </form>

          <div className="note-display">

            {
              notes.map((note) => {
                return (
                  <NoteItem HandleDeleteNote={HandleDeleteNote} note={note} setSelectNote={setSelectNote} />
                )
              })
            }
          </div>
        </div>
    </>
  );
};

export default MainComponent;
