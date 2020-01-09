import React from 'react'
import { useField } from '../hooks'
import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'

const NewBlogContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 10px;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  @media (max-width: 768px) {
    width: 80%;
  }
`

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px;
`

const FormLabel = styled.span`
  ${baseFont}
  color: ${colorNavy};
  font-size: 18px;
  padding: 2px;
  margin-right: 4px;
`

const FormInput = styled.input`
  ${baseFont}
  flex-basis: 100%;
  font-size: 18px;
  margin-left: 4px;
  padding: 2px;
  border-bottom-style: solid;
  border-width: 0px 0px 0.1em 0px;
  border-bottom-color: grey;

  &:focus {
    outline: none;
    border-bottom-color: ${colorNavy};
  }
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
    box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  }
  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  }
`

const FormTitle = styled.h2`
  font-size: 2em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  color: ${colorNavy};
  ${baseFont}
`

const FormHeader = styled.div`
  display: flex;
  width: 50%;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const NewBlog = (props) => {
  const [title, titleReset] = useField('text')
  const [author, authorReset] = useField('text')
  const [url, urlReset] = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.value) {
      alert('Blog needs a title')
      return
    }
    if (!url.value) {
      alert('Blog needs a url')
      return
    }
    props.createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })
    titleReset()
    authorReset()
    urlReset()
  }

  return (
    <NewBlogContainer>
      <FormHeader>
        <FormTitle>New blog</FormTitle>
      </FormHeader>
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormLabel>
            Title
          </FormLabel>
          <FormInput id='blog-title-input' {...title} />
        </FormRow>
        <FormRow>
          <FormLabel>
            Author
          </FormLabel>
          <FormInput id='blog-author-input' {...author} />
        </FormRow>
        <FormRow>
          <FormLabel>
            URL
          </FormLabel>
          <FormInput id='blog-url-input' {...url} />
        </FormRow>
        <Button type='submit'>Create</Button>
      </Form>
    </NewBlogContainer>
  )
}

export default NewBlog