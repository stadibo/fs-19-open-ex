import React from 'react'

import styled from 'styled-components'

const colorSuccess = '#b1cbbb'
const colorError = '#eea29a'

const Message = styled.div`
  color: black;
  background-color: ${props => props.type === 'error' ? colorError : colorSuccess};
  font-size: 20px;
  padding: 14px;
  margin: 8px;
  width: 50%;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border-radius: 3px;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  return (
    <Message>
      {notification.message}
    </Message>
  )
}

export default Notification