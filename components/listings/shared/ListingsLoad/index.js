import styled from 'styled-components'
import ListingsGrid from 'components/listings/shared/ListingsGrid'
import ListingCardLoad from 'components/listings/shared/ListingCardLoad'

const Wrapper = styled.div`
  height: 228px;
  overflow: hidden;
`

export default function ListingsLoad() {
  const items = []
  for (let i = 0; i < 6; i++) {
    items.push(<ListingCardLoad key={i} />)
  }

  return (
    <Wrapper>
      <ListingsGrid>{items}</ListingsGrid>
    </Wrapper>
  )
}
