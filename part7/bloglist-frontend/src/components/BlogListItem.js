import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'
const hoverColor = '#deeaee'

const StyledLink = styled(Link)`
  text-decoration: none;
  ${baseFont}
  font-size: 18px;
  padding: 12px;
  border-bottom: 1px solid ${colorNavy};
  &:hover {
    background-color: ${hoverColor};
  }
`

const BlogListItem = ({ blog }) => {
  return (
    <StyledLink to={`/blogs/${blog.id}`}>
      {blog.title} - {blog.author}
    </StyledLink>
  )
}


BlogListItem.propTypes = {
  blog: PropTypes.object.isRequired
}

export default BlogListItem