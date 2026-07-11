const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//get all user from database
usersRouter.get('/', async (request, response, next) => {
  try {
    const result = await User.find({}).populate('notes', {
      content: 1,
      important: 1,
    })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

//add a user to the database
usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
