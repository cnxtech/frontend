import styled from 'styled-components'
import Text from '@emcasa/ui-dom/components/Text'

export const Container = styled(Text)`
  position: relative;
  white-space: nowrap;
  font-size: inherit;

  svg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
`
