import Link from 'next/link'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {graphql} from 'react-apollo'
import {compose} from 'recompose'
import {GET_LISTING} from 'graphql/listings/queries'
import {GET_FAVORITE_LISTINGS_IDS} from 'graphql/user/queries'
import {thumbnailUrl} from 'utils/image_url'
import {buildSlug} from 'lib/listings'
import {getListingPrice, getListingSummary} from 'lib/listings'
import LikeButton from 'components/shared/Common/Buttons/Like'
import Container, {Body, ButtonContainer, Spinner} from './styles'

function ListingCard({listing, loading, onClick, favorite, user}) {
  if (loading || !listing)
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
        <Body>
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
        </Body>
      </Container>
    </Link>
  )
}

export default compose(
  graphql(GET_LISTING, {
    skip: ({listing}) => Boolean(listing),
    options: ({id}) => ({
      variables: {id}
    }),
    props: ({data, loading}) => ({
      loading: loading,
      listing: data && data.listing
    })
  }),
  graphql(GET_FAVORITE_LISTINGS_IDS, {
    skip: ({favorite}) => typeof favorite === 'boolean',
    props: ({ownProps, data}) => ({
      favorite: Boolean(
        data && (data.favoritedListings || []).find((id) => id === ownProps.id)
      )
    })
  })
)(ListingCard)
