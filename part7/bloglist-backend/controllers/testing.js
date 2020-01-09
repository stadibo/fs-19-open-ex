const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs } = require('../tests/test_helper')

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  response.status(204).end()
})

module.exports = router