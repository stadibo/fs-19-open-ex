import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initUsers } from '../reducers/usersReducer'

const UsersView = ({ initUsers, ...props }) => {
  const padding = { padding: 5 }
  useEffect(() => {
    initUsers()
  }, [initUsers])

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
                {user.name}
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

export default connect(mapStateToProps, { initUsers })(UsersView)