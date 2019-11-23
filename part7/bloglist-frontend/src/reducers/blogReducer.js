import blogService from '../services/blogs'

export const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'CREATE_BLOG':
    return [...state, action.data]
  case 'UPDATE_BLOG':
    return state.map(blog => blog.id === action.data.id ? action.data : blog)
  case 'DELETE_BLOG':
    return state.filter(blog => blog.id !== action.data.id)
  default:
    return state
  }
}



export const initializeBlogs = () =>
  (dispatch) => {
    blogService.getAll().then(blogs => {
      dispatch({ type: 'INIT_BLOGS', data: blogs })
    })
  }

export const createBlog = blog => ({ type: 'CREATE_BLOG', data: blog })
export const updateBlog = blog => ({ type: 'UPDATE_BLOG', data: blog })
export const deleteBlog = blog => ({ type: 'DELETE_BLOG', data: blog })