import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import LoginForm from './components/LoginForm'

import { useLoginStateValue } from './store'

import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/react-hooks'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  published
  genres
  author {
    id
    name
    born
    bookCount
  }
}
`

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
query allBooks($genre: String) {
  allBooks(genre: $genre) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
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

const ME = gql`
{
  me {
    username
    favoriteGenre
  }
}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`

const includedIn = (set, object) =>
  set.map(p => p.id).includes(object.id)

const App = () => {
  const [page, setPage] = useState('authors')
  const [{ loggedIn }, dispatch] = useLoginStateValue()
  const [redraw, setRedraw] = useState(0)

  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    // Update books
    let dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
    // Update authors
    dataInStore = client.readQuery({ query: ALL_AUTHORS })
    const author = addedBook.author
    if (!includedIn(dataInStore.allAuthors, author)) {
      dataInStore.allAuthors.push(author)
      client.writeQuery({
        query: ALL_AUTHORS,
        data: dataInStore
      })
    }
    setRedraw((value) => value + 1)
  }

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  const [addBook] = useMutation(ADD_BOOK, {
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    }
    // refetchQueries: [
    //   { query: ALL_AUTHORS },
    //   { query: ALL_BOOKS }
    // ]
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })


  const [login] = useMutation(LOGIN)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert('New book added!')
      updateCacheWith(subscriptionData.data.bookAdded)
    }
  })

  const logout = () => {
    dispatch({ type: 'logout' })
    localStorage.clear()
    client.resetStore()
    setPage('authors')
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
            <button onClick={() => setPage('recommended')}>recommended</button>
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
        redraw={redraw}
        bookQuery={ALL_BOOKS}
      />

      {
        loggedIn && <>
          <NewBook
            show={page === 'add'}
            addBook={addBook}
          />

          <Recommended
            show={page === 'recommended'}
            books={booksResult}
            userQuery={ME}
            redraw={redraw}
            bookQuery={ALL_BOOKS}
          />
        </>
      }

      <LoginForm
        show={page === 'login'}
        setPage={setPage}
        login={login}
      />

    </div>
  )
}

export default App