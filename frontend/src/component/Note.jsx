import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ note, id, toggleImportanceOf, deleteNote }) => {
  const navigate = useNavigate()
  const handleDelete = () => {
    if (window.confirm(`'Delete Note "${note.content}"`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }

  if (!note) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Loading note details...</h3>
      </div>
    )
  }
  const label = note.important ? 'make not important' : 'make important'
  return (
    <li className="note">
      <span>{note.content}</span>
      <span> </span>
      <button onClick={() => toggleImportanceOf(note.id)}>{label}</button>
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}

export default Note
