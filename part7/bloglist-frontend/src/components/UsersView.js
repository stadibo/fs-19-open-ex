import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 90%;
  flex-basis: 100%;
`

const Title = styled.h1`
  font-size: 2.5em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  color: ${colorNavy};
  ${baseFont}
`

const UsersView = (props) => {
  const padding = { padding: 5 }

  return (
    <Container>
      <Title>Users</Title>

      <table style={padding}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>
                {user.blogs ? user.blogs.length : 0}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Container>
  )
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

export default connect(mapStateToProps)(UsersView)