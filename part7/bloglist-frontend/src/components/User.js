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

const User = (props) => {
  if (!props.user)
    return null

  const padding = { padding: 5 }
  const title = { ...padding, marginBottom: 10, marginTop: 10 }

  return (
    <Container>
      <Title>
        {props.user.name}
      </Title>
      <h3 style={title}>Created blogs</h3>
      <ul>
        {props.user.blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </li>
        )}
      </ul>
    </Container>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.users.find(u => u.id === ownProps.userId)
  }
}

export default connect(mapStateToProps)(User)