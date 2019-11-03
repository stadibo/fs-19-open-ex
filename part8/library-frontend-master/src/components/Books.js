import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'

const Books = (props) => {
  const [selectedGenre, setGenre] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([])
  const client = useApolloClient()

  useEffect(() => {
    client.query({
      query: props.bookQuery,
      variables: {
        genre: selectedGenre
      },
      fetchPolicy: 'no-cache'
    }).then(result => {
      if (result.data && result.data.allBooks) {
        setFilteredBooks(result.data.allBooks)
      }
    })
  }, [client, selectedGenre, props.bookQuery, props.books.data])

  if (!props.show) {
    return null
  }

  if (props.books.loading) {
    return <div>loading...</div>
  }

  const getGenres = books => books
    .flatMap(b => b.genres)
    .filter((b, i, arr) => arr.indexOf(b) === i)
    .filter(g => Boolean(g))

  return (
    <div>
      <h2>books</h2>

      {
        props.books.data && props.books.data.allBooks &&
        < div style={{ maxWidth: '500px' }}>
          <button key={`${-1}-all`} onClick={() => setGenre('')} style={{ margin: '0 5px 5px 0', border: selectedGenre === '' && '2px solid #4CAF50' }}>all</button>
          {getGenres(props.books.data.allBooks).map((genre, i) => (
            <button key={`${i}-${genre}`} onClick={() => setGenre(genre)} style={{ margin: '0 5px 5px 0', border: selectedGenre === genre && '2px solid #4CAF50' }}>{genre}</button>
          ))}
        </div>
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
    </div >
  )
}

export default Books