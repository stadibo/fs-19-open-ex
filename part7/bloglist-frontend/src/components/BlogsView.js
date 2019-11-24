import React from 'react'
import { connect } from 'react-redux'
import BlogListItem from './BlogListItem'
import blogService from '../services/blogs'
import NewBlog from './NewBlog'
import Notification from './Notification'
import { createBlog } from '../reducers/blogReducer'
import { setMessage, clearMessage } from '../reducers/notificationReducer'

import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'

const BlogContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 90%;
  flex-basis: 100%;
`

const PageTitle = styled.h1`
  font-size: 2.5em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  color: ${colorNavy};
  ${baseFont}
`

const ListContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 10px;
  padding: 18px;
  border-radius: 3px;
  overflow: scroll;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  @media (max-width: 768px) {
    width: 80%;
  }
`

const BlogsView = (props) => {
  const notify = (message, type = 'success') => {
    props.setMessage({ message, type })
    setTimeout(props.clearMessage, 10000)
  }

  const createBlog = async (blog) => {
    const createdBlog = await blogService.create(blog)
    props.createBlog(createdBlog)
    notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes
  return (
    <BlogContainer>
      <PageTitle>Blogs</PageTitle>

      <Notification notification={props.notification} />

      <NewBlog createBlog={createBlog} />

      <ListContainer>
        {props.blogs.sort(byLikes).map(blog =>
          <BlogListItem
            key={blog.id}
            blog={blog}
          />
        )}
      </ListContainer>
    </BlogContainer>
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