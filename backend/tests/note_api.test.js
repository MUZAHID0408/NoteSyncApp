const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('When there is initially some notes are saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Note.deleteMany({})
    const savedUser = await User.insertMany(helper.initialUsers)
    const firstUser = savedUser[1]

    const initialNotesWithIds = helper.initialNotes.map((note) => ({
      ...note,
      userId: firstUser._id,
    }))
    await Note.insertMany(initialNotesWithIds)
  })

  //check returned note type as expected.
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  //check if all notes are returned or not
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  //Check a response body contains a particular note
  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map((e) => e.content)
    assert.strictEqual(contents.includes('HTML is easy'), true)
  })

  describe('Test for a specific note', async () => {
    //test for adding a valid note and check if the note is added.
    test('a valid note can be added ', async () => {
      const usersInDatabase = await User.find({})
      const demoUser = usersInDatabase[1]
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: demoUser._id,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const AllNotes = await helper.notesInDb()
      const contents = AllNotes.map((note) => note.content)
      assert.strictEqual(AllNotes.length, helper.initialNotes.length + 1)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    //test note without content will not be saved
    test('test without content is not saved in the database.', async () => {
      const newNote = {
        important: true,
      }

      await api.post('/api/notes').send(newNote).expect(400)
      const response = await api.get('/api/notes')
      assert.strictEqual(response.body.length, helper.initialNotes.length)
    })

    //test a specific note can be viewd
    test('a specific note can be viewd', async () => {
      const notesAtStart = await helper.notesInDb()
      const firstNote = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${firstNote.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, firstNote)
    })

    //test a note can be deleted
    test('a specific note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const firstNote = notesAtStart[0]

      await api.delete(`/api/notes/${firstNote.id}`).expect(204)
      const noteAtDatabase = await helper.notesInDb()

      const ids = noteAtDatabase.map((note) => note.id)
      assert(!ids.includes(firstNote.id))
      assert.strictEqual(noteAtDatabase.length, helper.initialNotes.length - 1)
    })
  })
})

// the test for users databaset and endpoints starts from here==========
// the test for users databaset and endpoints starts from here==========
// the test for users databaset and endpoints starts from here==========
// the test for users databaset and endpoints starts from here==========
// the test for users databaset and endpoints starts from here==========
// the test for users databaset and endpoints starts from here==========

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })
  //test for unique user name.
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
after(async () => {
  await mongoose.connection.close()
})

//To execute a single test you can use "--test-name-pattern" (first reade about it online), also can use the "only" syntax...
