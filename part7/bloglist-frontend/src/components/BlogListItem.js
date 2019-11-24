import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BlogListItem = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} - {blog.author}
      </Link>
    </div>
  )
}


BlogListItem.propTypes = {
  blog: PropTypes.object.isRequired
}

export default BlogListItem