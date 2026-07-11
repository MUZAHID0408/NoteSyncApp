const notesRouter = require('express').Router()
const Note = require('../models/note')
const { userExtractor } = require('../utils/middleware')

//get all the notes
notesRouter.get('/', async (request, response, next) => {
  try {
    const notes = await Note.find({}).populate('user', {
      username: 1,
      name: 1,
    })
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

//get notes by ID
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (!note) {
      response.status(404).end()
    } else {
      response.json(note)
    }
  } catch (error) {
    next(error)
  }
})

//add new note
notesRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'Note contents are required!!!' })
  }
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'User ID missing or not valid.' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

//update the importance of a note
notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body
  try {
    const note = await Note.findById(request.params.id)
    if (!note) {
      return response.status(404).end()
    }
    note.content = content
    note.important = important

    const savedNote = await note.save()
    return response.send(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)

    if (!note) {
      return response.status(404).json({ error: 'note not found' })
    }

    const user = request.user

    if (note.user.toString() !== user.id.toString()) {
      return response
        .status(401)
        .json({ error: 'unauthorized: you cannot delete this note' })
    }

    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
