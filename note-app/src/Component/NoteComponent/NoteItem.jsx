const NoteItem = ({ handleOpenModal,note, HandleDeleteNote, setSelectNote }) => {
      const hadleClick=(e)=>{
        handleOpenModal(e);
        setSelectNote(note);
      }
      return (
          <div className="note-item" key={note._id} >
            <div className="note-header">
              <button onClick={(e) => HandleDeleteNote(e, note._id)}>x</button>
            </div>
            <div onClick={(e) => hadleClick(e)}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
          </div>
      );
    
    
    };
    export default NoteItem;