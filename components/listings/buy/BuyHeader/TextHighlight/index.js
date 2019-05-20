import React from 'react'
import theme from '@emcasa/ui'
import {Container} from './styles'

const TextHighlight = (props) => {
  return (
    <Container inline>
      {props.children}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 233 6">
        <path
          fill="none"
          fillRule="evenodd"
          stroke={props.color || theme.colors.pink}
          strokeLinecap="round"
          strokeWidth={props.strokeWidth || '5'}
          d="M2 4C78.1769761 2.440275 153.616451.86269124 231 3.1453746"
        />
      </svg>
    </Container>
  )
}

export default TextHighlight
