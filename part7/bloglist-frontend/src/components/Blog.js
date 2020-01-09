import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import blogService from '../services/blogs'
import Notification from './Notification'
import { useField } from '../hooks'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
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

const Text = styled.span`
  ${baseFont}
  color: ${colorNavy};
  font-size: 18px;
  padding: 4px;
  margin-right: 4px;
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
    box-shadow: 0 3px 6px rgba(0,0,0,0.12);
  }
  &:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.12);
  }
`

const RemoveButton = styled(Button)`
  background: ${props => props.primary ? '#c94c4c' : 'white'};
  color: ${props => props.primary ? 'white' : '#c94c4c'};
  border-color: #c94c4c;
`

const FormButton = styled(Button)`
  margin-left: 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 8px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const Title = styled.h2`
  font-size: 2em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  color: ${colorNavy};
  ${baseFont}
`

const Header = styled.div`
  display: flex;
  width: 50%;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const Details = styled.section`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 10px;
  padding: 18px;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  @media (max-width: 768px) {
    width: 80%;
  }
`

const FormInput = styled.input`
  ${baseFont}
  flex-basis: 100%;
  font-size: 18px;
  padding: 6px;
  border-bottom-style: solid;
  border-width: 0px 0px 0.1em 0px;
  border-bottom-color: grey;

  &:focus {
    outline: none;
    border-bottom-color: ${colorNavy};
  }
`

const ListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 10px;
  padding: 18px;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledComment = styled.li`
  ${baseFont}
  list-style-type: none;
  font-size: 18px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 12px;
  border-left: 1px solid ${colorNavy};
`

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

  const isCreator = props.user && blog.user && props.user.username === blog.user.username
  return (
    <BlogContainer>
      <Header>
        <Title>
          {blog.title} - {blog.author}
        </Title>
      </Header>

      <Notification notification={props.notification} />

      <Details>
        <Row>
          <Text> URL: <a href={blog.url}>{blog.url}</a></Text>
        </Row>
        <Row>
          <Text>{blog.likes} likes</Text>
        </Row>
        {
          blog.user && 
          <Row>
            <Text>Added by {blog.user.name}</Text>
          </Row>
        }
        <span>
          <Button onClick={() => likeBlog(blog)}>Like</Button>
          {isCreator && (<RemoveButton onClick={() => removeBlog(blog)}>Remove </RemoveButton>)}
        </span>
      </Details>

      <Header>
        <Title>Comments</Title>
      </Header>
      <Form onSubmit={handleAddComment}>
        <FormInput {...comment} />
        <FormButton type="submit">Add comment</FormButton>
      </Form>
      <ListContainer>
        {blog.comments.map((comment, index) =>
          <StyledComment key={comment + '-' + index}>
            {comment}
          </StyledComment>
        )}
      </ListContainer>
    </BlogContainer>
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