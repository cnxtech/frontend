import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {withTheme} from 'styled-components'
import theme from '@emcasa/ui'
import {
  buildSlug,
  getListingSummary,
  getListingPrice,
  getListingValueRange
} from 'lib/listings'
import {
  log,
  LISTING_DETAIL_VIEW_FEATURED_LISTING
} from 'lib/logging'
import {thumbnailUrl} from 'utils/image_url'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import LikeButton from 'components/shared/Common/Buttons/Like'
import {
  Wrapper,
  Container,
  Title,
  LISTING_CARD_IMAGE_HEIGHT
} from './styles'
import {BUTTON_LIKE_CIRCLE_HEIGHT} from 'components/shared/Common/Buttons/Like/styles'

class ListingCard extends Component {
  render() {
    let {
      listing,
      currentUser,
      favorited: favoritedListings
    } = this.props

    const favorited =
      favoritedListings.filter(
        (actual) => actual.id.toString() === listing.id.toString()
      ).length > 0

    const thumbFilename = listing.images && listing.images[0] ? listing.images[0].filename : ''
    const thumbUrl = thumbnailUrl(thumbFilename, 600, 600)
    const listingSummary = getListingSummary(listing)
    const priceRange = getListingValueRange(listing, 'price')
    const priceRangeDelta = priceRange[1] - priceRange[0]

    return (
      <Wrapper>
        <Link
          href={`/listings/show?id=${listing.id}`}
          as={buildSlug(listing)}
          passHref
        >
          <Container aria-label={`listing-${listing.id}`} onClick={(e) => {
            if (e.target.tagName !== 'path') {
              if (this.props.related) {
                log(LISTING_DETAIL_VIEW_FEATURED_LISTING, {listingId: listing.id})
              }
            }
          }}>
            <img
              decoding="async"
              src={thumbUrl}
              alt={`Imagem do imóvel ID-${listing.id} na ${
                listing.address.street
              }, ${listing.address.neighborhood}, ${listing.address.city} - ${
                listing.address.state
              }`}
            />
            <Row flexDirection="column" p={2}>
              <Row justifyContent="space-between" mb={1}>
                <Title>
                  {`Imóvel na ${
                    listing.address.street
                  }, ${listing.address.neighborhood}, ${listing.address.city} - ${
                    listing.address.state
                  } - ID-${listing.id}`}
                </Title>
                <Text inline fontSize="small" fontWeight="bold">{listing.address.neighborhood}</Text>
                <Text inline fontSize="small" color="pink">{getListingPrice(listing)}</Text>
              </Row>
              <Text inline fontSize="small">{listing.address.street}</Text>
              <Text inline fontSize="small">{listingSummary}</Text>
            </Row>
          </Container>
        </Link>
        <LikeButton
          favorite={favorited}
          listing={listing}
          user={currentUser}
          secondary
          top={LISTING_CARD_IMAGE_HEIGHT - (BUTTON_LIKE_CIRCLE_HEIGHT + theme.space[2])}
        />
      </Wrapper>
    )
  }
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  favorited: PropTypes.array.isRequired,
  related: PropTypes.bool
}

export default withTheme(ListingCard)
