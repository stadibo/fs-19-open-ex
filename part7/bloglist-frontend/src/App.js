import React, { useEffect } from 'react'
import blogService from './services/blogs'
import LoginView from './components/LoginView'
import BlogsView from './components/BlogsView'
import { connect } from 'react-redux'
import { setMessage, clearMessage } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setFetchedUser, resetUser, initUser } from './reducers/userReducer'

const App = ({ initializeBlogs, initUser, ...props }) => {

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    initUser()
  }, [initUser])

  const handleLogout = () => {
    props.resetUser()
    blogService.destroyToken()
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  if (props.user === null) {
    return (
      <LoginView />
    )
  }

  return (
    <div>
      <span style={{ marginRight: '5px' }}>{props.user.name} logged in</span>
      <button onClick={handleLogout}>logout</button>
      <BlogsView />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs,
    notification: state.notification,
    user: state.user
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  setMessage,
  clearMessage,
  setFetchedUser,
  resetUser,
  initUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)