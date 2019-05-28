import {Component} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {withTheme} from 'styled-components'
import theme from '@emcasa/ui'
import {buildSlug, getListingSummary, getListingPrice} from 'lib/listings'
import {log, LISTING_DETAIL_VIEW_FEATURED_LISTING} from 'lib/logging'
import {thumbnailUrl} from 'utils/image_url'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Carousel from 'react-slick'
import LikeButton from 'components/shared/Common/Buttons/Like'
import {BUTTON_LIKE_CIRCLE_HEIGHT} from 'components/shared/Common/Buttons/Like/styles'
import {
  CarouselItem,
  SpinnerWrapper,
  Spinner
} from 'components/listings/show/ListingSlider/styles'
import {
  Wrapper,
  Container,
  Title,
  PaginationTextWrapper,
  PaginationText,
  LISTING_CARD_IMAGE_HEIGHT
} from './styles'

class ListingCard extends Component {
  state = {currentImage: 0}

  afterChange = (index) => {
    this.setState({currentImage: index})
  }

  render() {
    let {listing, currentUser, favorited: favoritedListings} = this.props
    const imagesLength = listing.images.length
    const {currentImage} = this.state

    const favorited =
      favoritedListings.filter(
        (actual) => actual.id.toString() === listing.id.toString()
      ).length > 0

    const listingSummary = getListingSummary(listing)
    const settings = {
      arrows: false,
      dots: false,
      className: 'images-slider',
      infinite: false,
      easing: 'ease-out',
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: false,
      speed: 500,
      focusOnSelect: true,
      lazyLoad: true,
      swipeToSlide: true,
      adaptiveHeight: false,
      afterChange: this.afterChange
    }

    return (
      <Wrapper>
        <Link
          href={`/listings/show?id=${listing.id}`}
          as={buildSlug(listing)}
          passHref
        >
          <Container
            aria-label={`listing-${listing.id}`}
            onClick={(e) => {
              if (e.target.tagName !== 'path') {
                if (this.props.related) {
                  log(LISTING_DETAIL_VIEW_FEATURED_LISTING, {
                    listingId: listing.id
                  })
                }
              }
            }}
          >
            <Carousel {...settings} ref={(slider) => (this.slider = slider)}>
              {listing.images.map(image => (
                <CarouselItem>
                  <img
                    decoding="async"
                    src={thumbnailUrl(image.filename ? image.filename : '', 400, 400 )}
                    alt={`Imagem do imóvel ID-${listing.id} na ${
                      listing.address.street
                    }, ${listing.address.neighborhood}, ${listing.address.city} - ${listing.address.state}`}
                  />
                  <SpinnerWrapper>
                    <Spinner />
                  </SpinnerWrapper>
                </CarouselItem>
              ))}
            </Carousel>
            <Row flexDirection="column" p={2}>
              <PaginationTextWrapper>
                <PaginationText>{currentImage + 1}/{imagesLength}</PaginationText>
              </PaginationTextWrapper>
              <Row justifyContent="space-between" mb={1}>
                <Title>
                  {`Imóvel na ${listing.address.street}, ${
                    listing.address.neighborhood
                  }, ${listing.address.city} - ${listing.address.state} - ID-${
                    listing.id
                  }`}
                </Title>
                <Text inline fontSize="small" fontWeight="bold">
                  {listing.address.neighborhood}
                </Text>
                <Text inline fontSize="small" color="pink">
                  {getListingPrice(listing)}
                </Text>
              </Row>
              <Text inline fontSize="small">
                {listing.address.street}
              </Text>
              <Text inline fontSize="small">
                {listingSummary}
              </Text>
            </Row>
          </Container>
        </Link>
        <LikeButton
          favorite={favorited}
          listing={listing}
          user={currentUser}
          secondary
          top={
            LISTING_CARD_IMAGE_HEIGHT -
            (BUTTON_LIKE_CIRCLE_HEIGHT + theme.space[2])
          }
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
