import { useState, useEffect } from 'react'
import noteServices from './services/Note'
import NoteList from './component/NoteList'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
} from 'react-router-dom'
import Footer from './component/Footer'
import NoteForm from './component/Noteform'
import Home from './component/Home'
import loginService from './services/login'
import Note from './component/Note'
import Notification from './component/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find((note) => String(note.id) === String(match.params.id))
    : null

  // Fetch initial notes
  useEffect(() => {
    noteServices.getAll().then((data) => {
      setNotes(data)
    })
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUser) {
      const userObj = JSON.parse(loggedUser)
      setUser(userObj)
      noteServices.setToken(userObj.token)
    }
  }, [])

  const toogleImportanceOf = (id) => {
    const targetNote = notes.find((note) => note.id === id)
    const changedNoteObj = { ...targetNote, important: !targetNote.important }
    noteServices
      .update(id, changedNoteObj)
      .then((updatedData) =>
        setNotes(notes.map((note) => (note.id === id ? updatedData : note))),
      )
      .catch((error) => {
        console.log(error)
        setErrorMessage(
          `the note '${targetNote.content}' was already deleted from server`,
        )
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const handleLogin = async (loginCredentials) => {
    try {
      const userObj = await loginService.login(loginCredentials)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(userObj))
      noteServices.setToken(userObj.token)
      setUser(userObj)
    } catch {
      alert('Wrong credentials')
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const addNote = (noteObject) => {
    noteServices.create(noteObject).then((createdData) => {
      setNotes(notes.concat(createdData))
    })
  }

  const handleDeleteNote = async (id) => {
    try {
      await noteServices.remove(id)
      setNotes(notes.filter((n) => n.id !== id))
      setSuccessMessage('Note deleted Successfully')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(`Operation failed: ${error}`)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          Home
        </Link>
        <Link style={padding} to="/notes">
          Notes
        </Link>
        <Link style={padding} to="/create">
          New Note
        </Link>

        <Notification message={errorMessage} type={'error'} />
        <Notification message={successMessage} type={'success'} />
        {user && (
          <span style={padding}>
            <i>{user.username} logged in</i>
            <button onClick={handleLogOut}>Logout</button>
          </span>
        )}
      </div>

      <Routes>
        <Route
          path="/notes/:id"
          element={
            <Note
              note={note}
              id={match ? match.params.id : null}
              toggleImportanceOf={toogleImportanceOf}
              deleteNote={handleDeleteNote}
            />
          }
        />

        <Route
          path="/notes"
          element={
            <NoteList
              notes={notes}
              user={user}
              handleLogin={handleLogin}
              handleLogOut={handleLogOut}
              setNotes={setNotes}
            />
          }
        />
        <Route path="/create" element={<NoteForm createNote={addNote} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </div>
  )
}
export default App
