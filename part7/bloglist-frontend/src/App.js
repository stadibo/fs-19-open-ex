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

import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'

const NavButton = styled(Link)`
  background: ${props => props.primary ? colorNavy : 'white'};
  color: ${props => props.primary ? 'white' : colorNavy};

  ${baseFont}
  font-size: 16px;
  flex-basis: 30%;
  padding: 4px 12px;
  border: 1px solid;
  border-color: ${colorNavy};

  &:focus {
    outline: none;
    box-shadow: 0 6px 12px rgba(0,0,0,0.12);
  }
  &:hover {
    box-shadow: 0 6px 12px rgba(0,0,0,0.12);
  }
`

const Text = styled.span`
  color: ${colorNavy};
  ${baseFont}
  font-size: 16px;
  
  text-align: right;
  align-self: flex-end;
  flex-basis: 25%;
  padding: 4px 12px;
`

const LogoutButton = styled.button`
  background: #deeaee;
  color: gray;

  ${baseFont}
  font-size: 16px;
  flex-basis: 15%;
  padding: 4px 12px;
  border: 1px solid;
  border-color: #deeaee;

  &:focus {
    outline: none;
    box-shadow: 0 6px 12px rgba(0,0,0,0.12);
  }
  &:hover {
    box-shadow: 0 6px 12px rgba(0,0,0,0.12);
  }
`

const NavBar = styled.nav`
  display: flex;
  flex-direction: row;
`

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

  return (
    <BrowserRouter>
      <>
        {props.user &&
          <NavBar>
            <NavButton primary to="/blogs">blogs</NavButton>
            <NavButton primary to="/users">users</NavButton>
            <Text primary>{props.user.name} logged in</Text>
            <LogoutButton primary onClick={handleLogout}>LOGOUT</LogoutButton>
          </NavBar>}
        <Switch>
          <Route exact path='/login' render={() => !props.user
            ? <LoginView />
            : <Redirect to="/blogs" />
          } />
          <Route exact path='/blogs' render={() => props.user
            ? <BlogsView />
            : <Redirect to="/login" />
          } />
          <Route exact path='/users' render={() => props.user
            ? <UsersView />
            : <Redirect to="/login" />
          } />
          <Route exact path='/users/:id' render={({ match }) => props.user
            ? <User userId={match.params.id} />
            : <Redirect to="/login" />
          } />
          <Route exact path='/blogs/:id' render={({ match }) => props.user
            ? <Blog blogId={match.params.id} />
            : <Redirect to="/login" />
          } />
          <Route path='/' render={() => <Redirect to='/blogs' />} />
        </Switch>
      </>
    </BrowserRouter>
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