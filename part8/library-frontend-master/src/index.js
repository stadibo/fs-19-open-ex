import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import { LoginStateProvider } from './store'

import App from './App'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

ReactDOM.render(
  <LoginStateProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </LoginStateProvider>,
  document.getElementById('root')
)