import React from 'react'
import { connect } from 'react-redux'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'
import { useField } from '../hooks'
import { setMessage, clearMessage } from '../reducers/notificationReducer'
import { setFetchedUser } from '../reducers/userReducer'

const LoginView = (props) => {
  const [username] = useField('text')
  const [password] = useField('password')

  const notify = (message, type = 'success') => {
    props.setMessage({ message, type })
    setTimeout(props.clearMessage, 10000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      props.setFetchedUser(user)
    } catch (exception) {
      notify('wrong username of password', 'error')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>

      <Notification notification={props.notification} />

      <form onSubmit={handleLogin}>
        <div>
          käyttäjätunnus
          <input {...username} />
        </div>
        <div>
          salasana
          <input {...password} />
        </div>
        <button type="submit">kirjaudu</button>
      </form>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}

export default connect(
  mapStateToProps,
  { setFetchedUser, setMessage, clearMessage }
)(LoginView)