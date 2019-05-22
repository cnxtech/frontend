import styled from 'styled-components'
import {themeGet} from 'styled-system'
import MultiMarker from '@emcasa/ui-dom/components/Map/MultiMarker'
import PaginatedMultiMarker from '@emcasa/ui-dom/components/Map/PaginatedMultiMarker'

export default function ListingMarker(props) {
  if (props.highlight.length) return <PaginatedMultiMarker borderRadius={10} bg='white' {...props} />
  else return <MultiMarker {...props} />
}
