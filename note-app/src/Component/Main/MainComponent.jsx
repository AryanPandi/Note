import { useState, useEffect, } from 'react';
import axios from 'axios';
import '../note.css';
import AddButton from '../Button/AddButton';
import UpdateButton from '../Button/UpdateButton';
import NoteItem from '../NoteComponent/NoteItem';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import io from 'socket.io-client'



const MainComponent = ({ currUser, setCurrUser }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const handleOpenModal = (e) => {
  e.preventDefault();
  setIsModalOpen(true);
}
const handleCloseModal = (e) => {
 e.preventDefault();
 setIsModalOpen(false);
}
 const [note, setNote] = useState({
  id: 0,
  title: "",
  content: "",
 });
 const [notes, setNotes] = useState([]);
 const [selectNote, setSelectNote] = useState(null);
 const [socket, setSocket] = useState(null);



 const navigate = useNavigate();


 useEffect(()=>{
  setSocket(io('http://localhost:3001'));
 },[]);
 useEffect(()=>{
  const storedUser = localStorage.getItem('currUser');
 if (storedUser) {
  setCurrUser(JSON.parse(storedUser));
 } else {
  toast.error("Session expired please login again");
  navigate('/login');
 }
 },[]);


 useEffect(() => {
  if (currUser) {
   axios.get('http://localhost:3001/n/getNote', {withCredentials: true, params: { currUser: currUser } })
    .then(res => {
     if(res.data.isAuth){
      setNotes(res.data.allNotes);
     }
     else{
      localStorage.removeItem('currUser',null);
     navigate('/login');
     }
    })
    .catch((err)=>{
     // console.log(err);
     localStorage.removeItem('currUser',null);
     navigate('/login');
    });
  }
 },[currUser]);

 useEffect(()=>{
  if(!socket) return;
  socket.emit('join_room',currUser._id);
  socket.on('noteAddition',(newNote)=>{
   setNotes([...notes,newNote]);
  });
  socket.on('noteUpdation',(updatedNote)=>{
   console.log("Inside Update Note:",updatedNote);
   const notess= notes.map((n)=>{
    if(n._id === updatedNote._id){
     return updatedNote;
    }else{
     return n;
    }
   });
   setNotes(notess);
  });


  socket.on('noteDeletion',(deletedNoteId)=>{
   const notess=notes.filter((n)=>{
    return n._id !== deletedNoteId;
   });
   setNotes(notess);
  })
  return () => {
   socket.off('noteAddition');
   socket.off('noteUpdation');
   socket.off('noteDeletion');
 };
 },[socket,notes]);


 const handleCancel = (e) => {
  e.preventDefault();
  setNote({ title: "", content: "" });
  setIsModalOpen(false);
  setSelectNote(null);
 }



 const HandleDeleteNote = (e, notedId) => {
  axios.delete(`http://localhost:3001/n/deleteNote/${notedId}`,{withCredentials: true,data:{currUser:currUser}})
   .then((res) => {
    if(res.data.isAuth){
     setNotes(note => {
      return note.filter(n => {
       return n._id !== res.data.deletedNote._id;
      })
     });
    }
    else{
     localStorage.removeItem('currUser',null);
     navigate('/login');
    }
   })
   .catch((err)=>{
    localStorage.removeItem('currUser',null);
     navigate('/login');
   });
 }; 


 const HandleLogout = () => {
  setCurrUser(null);
  localStorage.removeItem('currUser');
  navigate('/login');
 }
 const HandleAdminRedirection=(e,user)=>{
// e.preventDefault();
  navigate('/adminView');
 };



 return (
  <>
   <div className="app-header">
     {currUser
      ?
       <span>{currUser.username}</span>
      :
      <></>
     }
   
    <div className='buttonDiv'>
    <button className="logout-btn" onClick={HandleLogout}>Logout</button>
    {currUser && currUser.role && currUser.role == 'admin' && <button className='admin-btn' onClick={(e)=>HandleAdminRedirection(currUser)}>Admin View</button>}
    </div>
   </div>


   <div className="app-container">
      {selectNote != null ? (
       <UpdateButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} handleCancel={handleCancel} note={note} setNote={setNote} currUser={currUser} notes={notes} setNotes={setNotes} selectNote={selectNote} setSelectNote={setSelectNote} />
      )
       : (
        <AddButton note={note} setNote={setNote} currUser={currUser} notes={notes} setNotes={setNotes}/>
       )
      }
    
     <div className="note-display">
      {
       notes.map((note) => {
        return (
         <NoteItem isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} HandleDeleteNote={HandleDeleteNote} note={note} setSelectNote={setSelectNote} />
        )
       })
      }
     </div>
    </div>
  </>
 );
};


export default MainComponent;