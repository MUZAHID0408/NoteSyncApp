import Note from './Note'
import { useState } from 'react'
import Loginform from './LoginForm'
import Togglable from './Togglable'
import Notification from './Notification'
import noteServices from '../services/Note'
import { Link } from 'react-router-dom'

const NoteList = ({ notes, user, handleLogin, handleLogOut, setNotes }) => {
  const [showAll, setShowAll] = useState(true)
  const notetoShow = showAll ? notes : notes.filter((note) => note.important)
  

  return (
    <>
      <div>
        <h1>Notes</h1>
        

        {!user && (
          <Togglable buttonLabel="login">
            <Loginform logInHandler={handleLogin} />
          </Togglable>
        )}

        {user && (
          <div>
            <p>{user.username} logged in</p>
            <button onClick={handleLogOut}>Logout</button>
          </div>
        )}
      </div>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'All'}
        </button>
      </div>
      <ul>
        {notetoShow.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default NoteList
