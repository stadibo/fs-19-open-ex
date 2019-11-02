import React, { useState, useEffect } from 'react'
import { useApolloClient, useQuery } from '@apollo/react-hooks'

const Recommended = (props) => {
  const [filteredBooks, setFilteredBooks] = useState([])
  const client = useApolloClient()
  const userData = useQuery(props.userQuery)

  const genre = (userData.data
    && userData.data.me
    && userData.data.me.favoriteGenre) || ''

  useEffect(() => {
    client.query({
      query: props.bookQuery,
      variables: { genre },
      fetchPolicy: 'no-cache'
    }).then(result => {
      if (result.data && result.data.allBooks) {
        setFilteredBooks(result.data.allBooks)
      }
    })
  }, [client, genre, props.bookQuery, userData.data, props.books.data])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      {
        genre ?
          <p>books in your favorite genre <b>{genre}</b></p>
          :
          <p>you don't have a favorite genre</p>
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended