import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

import { useLoginStateValue } from './store'

import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'

const ALL_AUTHORS = gql`
{
  allAuthors {
    id
    name
    born
    bookCount
  } 
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    id
    title
    author {
      id
      name
    }
    published
  }
}
`

const ADD_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    id
    title
    published
    author {
      id
      name
    }
  }
}
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    id
    name
    born
    bookCount
  }
}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [{ loggedIn }, dispatch] = useLoginStateValue()

  const client = useApolloClient()

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS }
    ]
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })

  const [login] = useMutation(LOGIN)

  const logout = () => {
    dispatch({ type: 'logout' })
    setPage('authors')
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!loggedIn ?
          <button onClick={() => setPage('login')}>login</button>
          : <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        }
      </div>

      <Authors
        show={page === 'authors'}
        authors={authorsResult}
        editAuthor={editAuthor}
      />

      <Books
        show={page === 'books'}
        books={booksResult}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

      <LoginForm
        show={page === 'login'}
        setPage={setPage}
        login={login}
      />

    </div>
  )
}

export default App