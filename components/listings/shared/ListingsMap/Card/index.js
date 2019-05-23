import Link from 'next/link'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {thumbnailUrl} from 'utils/image_url'
import {buildSlug} from 'lib/listings'
import {getListingPrice, getListingSummary} from 'lib/listings'
import LikeButton from 'components/shared/Common/Buttons/Like'
import Container, {ButtonContainer, Spinner} from './styles'

export default function ListingCard({
  listing,
  loading,
  onClick,
  favorite,
  user
}) {
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
    <Link
      href={`/listings/show?id=${listing.id}`}
      as={buildSlug(listing)}
      passHref
    >
      <Container onClick={onClick}>
        <ButtonContainer>
          <LikeButton
            favorite={favorite}
            listing={listing}
            user={user}
            secondary
          />
        </ButtonContainer>

        <img decoding="async" src={thumbUrl} />
        <Col p={2}>
          <Row mb={1} justifyContent="space-between">
            <Text inline fontSize="small" fontWeight="bold">
              {listing.address.neighborhood}
            </Text>
            <Text inline fontSize="small" color="pink">
              {getListingPrice(listing)}
            </Text>
          </Row>
          <Row>
            <Text inline fontSize="xsmall" alt={summary}>
              {summary}
            </Text>
          </Row>
        </Col>
      </Container>
    </Link>
  )
}
