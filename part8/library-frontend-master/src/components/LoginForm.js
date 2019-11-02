import React, { useState } from 'react'
import { useLoginStateValue } from '../store'

const LoginForm = ({ login, show, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [, dispatch] = useLoginStateValue()

  const submit = async (event) => {
    event.preventDefault()

    const result = await login({
      variables: { username, password }
    })

    if (result) {
      const token = result.data.login.value
      dispatch({
        type: 'login',
        data: {
          token
        }
      })
      setPage('authors')
      setUsername('')
      setPassword('')
    }
  }

  if (!show) return null

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm