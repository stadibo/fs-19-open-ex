import React, { useEffect } from 'react'
import blogService from './services/blogs'
import LoginView from './components/LoginView'
import BlogsView from './components/BlogsView'
import UsersView from './components/UsersView'
import { connect } from 'react-redux'
import { setMessage, clearMessage } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setFetchedUser, resetUser, initUser } from './reducers/userReducer'

import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import Blog from './components/Blog'

const App = ({ initializeBlogs, initUser, blogs, ...props }) => {

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

  if (props.loadingUser) {
    return <div>Loading...</div>
  }

  const padding = { padding: 5 }
  const navMargin = { marginRight: '5px' }

  return (
    <div>
      <BrowserRouter>
        <>
          <div>
            <Link style={padding} to="/blogs">notes</Link>
            <Link style={padding} to="/users">users</Link>
            {props.user &&
              <>
                <span style={{ ...navMargin, ...padding }}>{props.user.name} logged in</span>
                <button onClick={handleLogout}>logout</button>
              </>}
          </div>
          <Switch>
            <Route exact path='/login' render={() => !props.user
              ? <LoginView />
              : <Redirect to="/blogs" />
            } />
            <Route exact path='/blogs' render={() => props.user
              ? <BlogsView />
              : <Redirect to="/login" />
            } />
            <Route exact path='/users/:id' render={({ match }) =>
              <Blog blogId={match.params.id} />
            } />
            <Route exact path='/users' render={() => <UsersView />} />
            <Route path='/' render={() => <Redirect to='/blogs' />} />
          </Switch>
        </>
      </BrowserRouter>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs,
    notification: state.notification,
    user: state.user.user,
    loadingUser: state.user.loading
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