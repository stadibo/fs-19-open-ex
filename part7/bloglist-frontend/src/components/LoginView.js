import React from 'react'
import { connect } from 'react-redux'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'
import { useField } from '../hooks'
import { setMessage, clearMessage } from '../reducers/notificationReducer'
import { setFetchedUser } from '../reducers/userReducer'

import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 80%;
  flex-basis: 100%;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 10px;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  @media (max-width: 768px) {
    width: 80%;
  }
`

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px;
`

const FormLabel = styled.span`
  ${baseFont}
  color: ${colorNavy};
  font-size: 18px;
  padding: 2px;
  margin-right: 4px;
`

const FormInput = styled.input`
  ${baseFont}
  flex-basis: 100%;
  font-size: 18px;
  margin-left: 4px;
  padding: 2px;
  border-bottom-style: solid;
  border-width: 0px 0px 0.1em 0px;
  border-bottom-color: grey;

  &:focus {
    outline: none;
    border-bottom-color: ${colorNavy};
  }
`

const Button = styled.button`
  background: ${props => props.primary ? colorNavy : 'white'};
  color: ${props => props.primary ? 'white' : colorNavy};

  ${baseFont}
  font-size: 16px;
  margin: 12px;
  padding: 4px 12px;
  border: 2px solid;
  border-color: ${colorNavy};
  border-radius: 3px;

  align-self: flex-start;
  &:focus {
    outline: none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.12), 0 3px 3px rgba(0,0,0,0.28);
  }
  &:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.12), 0 3px 3px rgba(0,0,0,0.28);
  }
`

const PageTitle = styled.h1`
  font-size: 2.5em;
  color: ${colorNavy};
  ${baseFont}
`

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
    <LoginContainer>
      <PageTitle>Log in</PageTitle>

      <Notification notification={props.notification} />

      <Form onSubmit={handleLogin}>
        <FormRow>
          <FormLabel>
            Username
          </FormLabel>
          <FormInput id='username' {...username} />
        </FormRow>
        <FormRow>
          <FormLabel>
            Password
          </FormLabel>
          <FormInput id='password' {...password} />
        </FormRow>
        <Button primary type="submit">Login</Button>
      </Form>
    </LoginContainer>
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