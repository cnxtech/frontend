import styled from 'styled-components'
import Marker from '@emcasa/ui-dom/components/Map/Marker'

export default styled(Marker).attrs(
  ({highlight}) =>
    highlight
      ? {
          borderRadius: 10,
          bg: 'white',
          p: 0
        }
      : {}
)`
  img {
    border-radius: 10px 10px 0 0;
  }
`
