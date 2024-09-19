const UpdateButton = ({ handleCancel }) => {
    return (
        <div className='edit-btn'>
            <button type='submit'>Save</button>
            <button onClick={(e) => handleCancel(e)}>Cancel</button>
        </div>
    )
};
export default UpdateButton;