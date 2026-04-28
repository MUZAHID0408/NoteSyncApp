import { useState, useEffect } from "react";
import Note from "./component/Note";
import noteServices from "./services/Note";
import Notification from "./component/Notification";
import Footer from "./component/Footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setnewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const notetoShow = showAll ? notes : notes.filter((note) => note.important);
  const [errorMessage, setErrorMessage] = useState(null);

  //Get list from Server

  useEffect(() => {
    console.log("effect");

    noteServices.getAll().then((data) => {
      setNotes(data);
    });
  }, []);
  console.log("render", notes.length, "notes");

  //===========================
  // EventHandler
  //===========================

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setnewNote(event.target.value);
  };

  //Toggling the note importance value
  const toogleImportanceOf = (id) => {
    console.log(`The importance of id ${id} needs to be toggled`);
    const targetNote = notes.find((note) => note.id === id);
    const changedNoteObj = { ...targetNote, important: !targetNote.important };

    noteServices
      .update(id, changedNoteObj)
      .then((updatedData) =>
        setNotes(notes.map((note) => (note.id === id ? updatedData : note))),
      )
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          `the note '${targetNote.content}' was already deleted from server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  //Add Note to the list
  const addNote = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);
    if (newNote.length !== 0) {
      const noteObj = {
        content: newNote,
        important: Math.random() < 0.5,
      };

      noteServices.create(noteObj).then((createdData) => {
        setNotes(notes.concat(createdData));
        setnewNote("");
      });
    }
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "All"}
        </button>
      </div>
      {/* //{console.log(notes)} */}
      <ul>
        {notetoShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toogleImportance={() => toogleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          placeholder="write a note"
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  );
};

export default App;
