import styled from 'styled-components'
import Row from '@emcasa/ui-dom/components/Row'
import {themeGet} from 'styled-system'

const FiltersRow = styled(Row)`
  align-items: stretch;

  > :first-child {
    margin-right: ${themeGet('space.2')}px;
    flex-grow: 1;
  }
  > :last-child {
    margin-left: ${themeGet('space.2')}px;
    flex-grow: 1;
  }
`

export {FiltersRow}
