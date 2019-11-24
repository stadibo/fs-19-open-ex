import blogService from '../services/blogs'

export const userReducer = (state = { user: null, loading: true }, action) => {
  switch (action.type) {
  case 'FETCHED_USER':
    return { user: action.data, loading: false }
  case 'RESET_USER':
    return { user: null, loading: false }
  case 'USER_LOADING':
    return { ...state, loading: true }
  default:
    return state
  }
}

export const initUser = () =>
  async (dispatch) => {
    dispatch({ type: 'USER_LOADING' })
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setFetchedUser(user))
      blogService.setToken(user.token)
    } else {
      dispatch({ type: 'RESET_USER' })
    }
  }

export const setFetchedUser = (user) => ({ type: 'FETCHED_USER', data: user })
export const resetUser = () => ({ type: 'RESET_USER' })