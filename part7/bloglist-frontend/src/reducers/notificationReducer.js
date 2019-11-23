export const notificationReducer = (state = { message: null }, action) => {
  switch (action.type) {
  case 'SET_MESSAGE':
    return action.data
  case 'CLEAR_MESSAGE':
    return { message: null }
  default:
    return state
  }
}

export const setMessage = ({ message, type }) => ({ type: 'SET_MESSAGE', data: { message, type } })
export const clearMessage = () => ({ type: 'CLEAR_MESSAGE' })