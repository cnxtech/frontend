import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {thumbnailUrl} from 'utils/image_url'
import {getListingPrice, getListingSummary} from 'lib/listings'
import Container, {Spinner} from './styles'

export default function ListingCard({listing, loading, onClick}) {
  if (loading)
    return (
      <Container>
        <Spinner />
      </Container>
    )
  const thumbFilename =
    listing.images && listing.images[0] ? listing.images[0].filename : ''
  const thumbUrl = thumbnailUrl(thumbFilename, 600, 600)
  const summary = getListingSummary(listing)
  return (
    <Container onClick={onClick}>
      <img decoding="async" src={thumbUrl} />
      <Col p={2}>
        <Row mb={1} justifyContent="space-between">
          <Text inline fontSize="small" fontWeight="bold">
            ...
          </Text>
          <Text inline fontSize="small" color="pink">
            {getListingPrice(listing.price)}
          </Text>
        </Row>
        <Row>
          <Text inline fontSize="xsmall" alt={summary}>
            {summary}
          </Text>
        </Row>
      </Col>
    </Container>
  )
}
