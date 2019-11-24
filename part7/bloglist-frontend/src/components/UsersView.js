import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const UsersView = (props) => {
  const padding = { padding: 5 }

  return (
    <>
      <h2 style={{ ...padding, marginBottom: 10, marginTop: 10 }}>Users</h2>

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
    </>
  )
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

export default connect(mapStateToProps)(UsersView)