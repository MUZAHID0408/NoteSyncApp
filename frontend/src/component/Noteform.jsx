import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()
  const handleNoteChange = (event) => {
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const newNoteBody = (event) => {
    event.preventDefault()
    if (newNote.length !== 0) {
      const noteObj = {
        content: newNote,
        important: false,
      }

      createNote(noteObj)
      navigate('/notes')
      setNewNote('')
    }
  }

  return (
    <>
      <h2>Create a Note</h2>
      <form onSubmit={newNoteBody}>
        <label>
          content
          <input
            value={newNote}
            onChange={handleNoteChange}
            placeholder="write a note..."
            id="note-input"
          />
        </label>
        <button type="submit">save</button>
      </form>
    </>
  )
}

export default NoteForm
