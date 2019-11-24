import React from 'react'
import { connect } from 'react-redux'
import BlogListItem from './BlogListItem'
import blogService from '../services/blogs'
import NewBlog from './NewBlog'
import Togglable from './Togglable'
import Notification from './Notification'
import { createBlog } from '../reducers/blogReducer'
import { setMessage, clearMessage } from '../reducers/notificationReducer'

const BlogsView = (props) => {
  const notify = (message, type = 'success') => {
    props.setMessage({ message, type })
    setTimeout(props.clearMessage, 10000)
  }

  const createBlog = async (blog) => {
    const createdBlog = await blogService.create(blog)
    newBlogRef.current.toggleVisibility()
    props.createBlog(createdBlog)
    notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  }

  const newBlogRef = React.createRef()
  const padding = { padding: 5 }

  const byLikes = (b1, b2) => b2.likes - b1.likes
  return (
    <div>
      <h2 style={{ ...padding, marginBottom: 10, marginTop: 10 }}>Blogs</h2>

      <Notification notification={props.notification} />

      <Togglable buttonLabel='create new' ref={newBlogRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

      <section style={padding}>
        {props.blogs.sort(byLikes).map(blog =>
          <BlogListItem
            key={blog.id}
            blog={blog}
          />
        )}
      </section>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs,
    notification: state.notification,
    user: state.user.user
  }
}

const mapDispatchToProps = {
  createBlog,
  setMessage,
  clearMessage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogsView)