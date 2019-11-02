import React, { useState } from 'react'
import Select from 'react-select'

const Authors = ({ show, authors, editAuthor }) => {

  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!author || !born) return

    await editAuthor({
      variables: { name: author.label, setBornTo: parseInt(born) }
    })

    setAuthor('')
    setBorn('')
  }

  if (!show) {
    return null
  }

  if (authors.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div style={{ width: "200px", padding: "0px 0px 5px 0px" }}>
          <Select
            value={author}
            onChange={selectedOption => setAuthor(selectedOption)}
            options={authors.data.allAuthors.map(a => { return { value: a.id, label: a.name } })}
          />
        </div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors