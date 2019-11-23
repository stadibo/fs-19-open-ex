import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'
import blogService from '../services/blogs'
import NewBlog from './NewBlog'
import Togglable from './Togglable'
import Notification from './Notification'
import { createBlog, updateBlog, deleteBlog } from '../reducers/blogReducer'
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

  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    const updatedBlog = await blogService.update(likedBlog)
    props.updateBlog(updatedBlog)
    notify(`blog ${updatedBlog.title} by ${updatedBlog.author} liked!`)
  }

  const removeBlog = async (blog) => {
    const ok = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      const updatedBlog = await blogService.remove(blog)
      props.deleteBlog(updatedBlog)
      notify(`blog ${updatedBlog.title} by ${updatedBlog.author} removed!`)
    }
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
          <Blog
            key={blog.id}
            blog={blog}
            like={likeBlog}
            remove={removeBlog}
            user={props.user}
            creator={blog.user.username === props.user.username}
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
  updateBlog,
  deleteBlog,
  setMessage,
  clearMessage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogsView)