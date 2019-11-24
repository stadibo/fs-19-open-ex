import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import blogService from '../services/blogs'
import Notification from './Notification'
import { useField } from '../hooks'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
import { setMessage, clearMessage } from '../reducers/notificationReducer'

const Blog = ({ blog, ...props }) => {
  const [comment, resetComment] = useField('text')

  const notify = (message, type = 'success') => {
    props.setMessage({ message, type })
    setTimeout(props.clearMessage, 10000)
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
      await blogService.remove(blog)
      props.deleteBlog(blog)
      notify(`blog ${blog.title} by ${blog.author} removed!`)
      props.history.push('/blogs')

    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!comment.value.trim()) {
      alert('Comment cannot be empty!')
      return
    }
    try {
      const updatedBlog = await blogService.createComment(blog.id, comment.value)
      props.updateBlog(updatedBlog)
      notify(`added comment ${comment.value}!`)
      resetComment()
    } catch (e) {
      notify('failed to create comment', 'error')
    }
  }

  if (!blog) return null

  const padding = { padding: 5 }
  const title = { ...padding, marginBottom: 10, marginTop: 10 }
  const noDecoration = { textDecoration: 'none' }

  const isCreator = props.user.username === blog.user.username
  return (
    <>
      <h1>{blog.title} - {blog.author}</h1>

      <Notification notification={props.notification} />

      <div className='details'>
        <a href={blog.url}>{blog.url}</a>
        <div>{blog.likes} likes
          <button onClick={() => likeBlog(blog)}>like</button>
        </div>
        <div>added by {blog.user.name}</div>
        {isCreator && (<button onClick={() => removeBlog(blog)}>remove </button>)}
      </div>

      <h2 style={title}>Comments</h2>
      <form onSubmit={handleAddComment}>
        <input {...comment} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) =>
          <li style={noDecoration} key={comment + '-' + index}>
            {comment}
          </li>
        )}
      </ul>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    blog: state.blogs.find(b => b.id === ownProps.blogId),
    notification: state.notification,
    user: state.user.user
  }
}

const mapDispatchToProps = {
  updateBlog,
  deleteBlog,
  setMessage,
  clearMessage,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blog))