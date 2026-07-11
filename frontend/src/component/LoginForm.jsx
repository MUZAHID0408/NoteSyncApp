import { useState } from 'react'

const LoginForm = ({ logInHandler }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const newCredential = (event) => {
    event.preventDefault()
    const loginCredentials = {
      username,
      password,
    }
    logInHandler(loginCredentials)
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <form onSubmit={newCredential}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm
