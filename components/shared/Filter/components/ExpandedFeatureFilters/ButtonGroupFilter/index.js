import React from 'react'
import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Button from '@emcasa/ui-dom/components/Button'

const ButtonGroup = styled(function ButtonGroup({
  children,
  style,
  className,
  strategy,
  currentValue,
  onChange
}) {
  return (
    <Button.Group
      style={style}
      className={className}
      strategy={strategy}
      selectedValue={currentValue}
      onChange={onChange}
    >
      {React.Children.map(children, (element) =>
        React.cloneElement(element, {
          className: 'filterButton',
          type: 'button'
        })
      )}
    </Button.Group>
  )
})`
  margin-left: -${themeGet('space.2')}px;
  margin-bottom: -${themeGet('space.2')}px;
  flex-wrap: wrap;
  .filterButton {
    margin-left: ${themeGet('space.2')}px;
    margin-bottom: ${themeGet('space.2')}px;
  }
`

export default ButtonGroup
