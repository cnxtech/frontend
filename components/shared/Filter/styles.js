import styled from 'styled-components'
import {themeGet} from 'styled-system'
import theme from '@emcasa/ui'
import React from 'react'

const Icon = styled((props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M-2-4h24v24H-2z" />
      <path
        stroke={theme.colors.pink}
        strokeLinecap="round"
        strokeWidth="2"
        d="M19.5 3.5H6h13.5zm-4.5 9H1.10546875 15zM3.5 6C2.11928813 6 1 4.88071187 1 3.5S2.11928813 1 3.5 1 6 2.11928813 6 3.5 4.88071187 6 3.5 6zm14 9c-1.3807119 0-2.5-1.1192881-2.5-2.5s1.1192881-2.5 2.5-2.5 2.5 1.1192881 2.5 2.5-1.1192881 2.5-2.5 2.5z"
      />
    </g>
  </svg>
))`
  margin-right: 10px;
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  font-size: inherit;
  overflow: visible;
`

export {Icon}
