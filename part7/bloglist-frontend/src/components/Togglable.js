import React, { useState, useImperativeHandle } from 'react'

import styled from 'styled-components'

const baseFont = 'font-family: Open Sans, sans-serif;'
const colorNavy = '#034f84'

const Button = styled.button`
  background: ${props => props.primary ? colorNavy : 'white'};
  color: ${props => props.primary ? 'white' : colorNavy};

  ${baseFont}
  font-size: 16px;
  margin: 12px 12px 12px 0px;
  padding: 4px 12px;
  border: 2px solid;
  border-color: ${colorNavy};
  border-radius: 3px;

  &:focus {
    outline: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  }
  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  }
`

const Togglable = React.forwardRef(function TogglableComponent(props, ref) {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  const padding = { padding: '5px' }

  return (
    <div style={padding}>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

export default Togglable