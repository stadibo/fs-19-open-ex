import React, { createContext, useContext, useReducer } from 'react'

export const LoginStateContext = createContext(false)

const loginReducers = {
  login: (state, { data }) => {
    localStorage.setItem('libraryUserToken', data.token)
    return { loggedIn: true, token: data.token }
  },
  logout: () => ({ loggedIn: false, token: null })
}

const loginReducer = (state, action) => loginReducers[action.type](state, action)

let userData
try {
  userData = { token: localStorage.getItem('libraryUserToken') }
} catch (error) {
  userData = {}
}
userData.loggedIn = Boolean(userData.token)

export const LoginStateProvider = ({ children }) => (
  <LoginStateContext.Provider value={useReducer(loginReducer, userData)}>
    {children}
  </LoginStateContext.Provider>
)

export const useLoginStateValue = () => useContext(LoginStateContext)