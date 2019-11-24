import React, { useEffect } from 'react'
import blogService from './services/blogs'
import LoginView from './components/LoginView'
import BlogsView from './components/BlogsView'
import UsersView from './components/UsersView'
import User from './components/User'
import Blog from './components/Blog'
import { connect } from 'react-redux'
import { setMessage, clearMessage } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setFetchedUser, resetUser, initUser } from './reducers/userReducer'

import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'

const App = ({ initializeBlogs, initUser, initializeUsers, ...props }) => {

  useEffect(() => {
    if (props.user) {
      initializeBlogs()
      initializeUsers()
    } else {
      initUser()
    }
  }, [initializeBlogs, initializeUsers, initUser, props.user])

  const handleLogout = () => {
    props.resetUser()
    blogService.destroyToken()
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  if (props.loadingUser) {
    return <div>Loading...</div>
  }

  const padding = { padding: 5 }
  const navMargin = { marginRight: '5px' }

  return (
    <div>
      <BrowserRouter>
        <>
          {props.user &&
            <>
              <Link style={padding} to="/blogs">blogs</Link>
              <Link style={padding} to="/users">users</Link>
              <span style={{ ...navMargin, ...padding }}>{props.user.name} logged in</span>
              <button onClick={handleLogout}>logout</button>
            </>}
          <Switch>
            <Route exact path='/login' render={() => !props.user
              ? <LoginView />
              : <Redirect to="/blogs" />
            } />
            <Route exact path='/blogs' render={() => props.user
              ? <BlogsView />
              : <Redirect to="/login" />
            } />
            <Route exact path='/users' render={() => <UsersView />} />
            <Route exact path='/users/:id' render={({ match }) =>
              <User userId={match.params.id} />
            } />
            <Route exact path='/blogs/:id' render={({ match }) =>
              <Blog blogId={match.params.id} />
            } />
            <Route path='/' render={() => <Redirect to='/blogs' />} />
          </Switch>
        </>
      </BrowserRouter>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    notification: state.notification,
    user: state.user.user,
    loadingUser: state.user.loading
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  initializeUsers,
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