import React from 'react'
import { connect } from 'react-redux'

const User = (props) => {
  if (!props.user)
    return null

  const padding = { padding: 5 }
  const title = { ...padding, marginBottom: 10, marginTop: 10 }

  return (
    <>
      <h2 style={title}>
        {props.user.name}
      </h2>
      <h3 style={title}>Created blogs</h3>
      <ul>
        {props.user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.users.find(u => u.id === ownProps.userId)
  }
}

export default connect(mapStateToProps)(User)