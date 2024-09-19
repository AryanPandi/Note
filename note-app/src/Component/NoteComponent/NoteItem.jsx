const NoteItem = ({ note, HandleDeleteNote, setSelectNote }) => {
    return (
        <div key={note._id}>
            <div className="note-item" >
                <div className="note-header">
                    <button onClick={(e) => HandleDeleteNote(e, note._id)}>x</button>
                </div>
                <div onClick={(e) => setSelectNote(note)}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            </div>
        </div>
    );

};
export default NoteItem;