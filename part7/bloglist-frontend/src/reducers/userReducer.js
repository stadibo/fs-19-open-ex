import blogService from '../services/blogs'

export const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'FETCHED_USER':
    return action.data
  case 'RESET_USER':
    return null
  default:
    return state
  }
}

export const initUser = () =>
  async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setFetchedUser(user))
      blogService.setToken(user.token)
    }
  }

export const setFetchedUser = (user) => ({ type: 'FETCHED_USER', data: user })
export const resetUser = () => ({ type: 'RESET_USER' })