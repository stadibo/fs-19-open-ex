import usersService from '../services/users'

export const usersReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.data
  default:
    return state
  }
}

export const initUsers = () =>
  async (dispatch) => {
    const users = await usersService.getAll()
    dispatch({ type: 'INIT_USERS', data: users })
  }