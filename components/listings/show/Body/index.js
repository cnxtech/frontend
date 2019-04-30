import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {getParagraphs} from 'utils/text-utils'
import {canEdit} from 'permissions/listings-permissions'
import {
  log,
  getListingInfoForLogs,
  LISTING_DETAIL_OPEN,
  LISTING_DETAIL_EXPAND_DESCRIPTION
} from 'lib/logging'
import View from '@emcasa/ui-dom/components/View'
import Col from '@emcasa/ui-dom/components/Col'
import ListingInfo from './ListingInfo'
import ListingDescription from './ListingDescription'
import DevelopmentPhase from './DevelopmentPhase'
import ListingsFeed from 'components/shared/Listing/Feed'
import {Container, DevelopmentContainer} from './styles'

class ListingMainContent extends Component {
  componentDidMount() {
    log(LISTING_DETAIL_OPEN, getListingInfoForLogs(this.props.listing))
  }

  onExpandDescription = () => {
    log(LISTING_DETAIL_EXPAND_DESCRIPTION, getListingInfoForLogs(this.props.listing))
  }

  render() {
    const {
      listing,
      user,
      openMatterportPopup,
      openMapPopup,
      openStreetViewPopup
    } = this.props
    const {street, neighborhood, streetNumber} = listing.address
    const paragraphs = getParagraphs(listing.description)
    const ownerOrAdmin = canEdit(user, listing)
    const listingUserInfo = ownerOrAdmin
      ? `${street}, ${streetNumber} ${
        listing.complement ? `- ${listing.complement}` : ''}`
      : `${street}`
    const developmentListings = listing.development
        ? listing.development.listings.filter(
          ({id}) => id !== listing.id
        )
        : []
    return (
      <Col alignItems="center" width="100%" mt={5}>
        <Container>
          <ListingInfo
            listing={listing}
            title={`${listingUserInfo}, ${neighborhood}, ${
              listing.address.city
            }`}
            openMatterportPopup={openMatterportPopup}
            openMapPopup={openMapPopup}
            openStreetViewPopup={openStreetViewPopup}
          />
          <View flex="1 1 100%" pb={5}>
            {listing.development && (
              <DevelopmentPhase phase={listing.development.phase} />
            )}
            <ListingDescription
              title="Sobre o imóvel"
              address={listing.address}
              tags={listing.tags}
              paragraphs={getParagraphs(listing.description)}
              onExpand={this.onExpandDescription}
            />
          </View>
        </Container>
        {listing.development && (
          <DevelopmentContainer>
            <ListingDescription
              bg="snow"
              title="Sobre o empreendimento"
              paragraphs={getParagraphs(listing.development.description)}
            >
              {developmentListings.length && (
                <View className="listingsFeed" width="100vw">
                  <ListingsFeed
                    bg="snow"
                    title="Imóveis do empreendimento"
                    listings={developmentListings}
                  />
                </View>
              )}
            </ListingDescription>
          </DevelopmentContainer>
        )}
      </Col>
    )
  }
}

ListingMainContent.propTypes = {
  listing: PropTypes.object.isRequired,
  user: PropTypes.object,
  favorite: PropTypes.bool,
  openMatterportPopup: PropTypes.func,
  openMapPopup: PropTypes.func,
  openStreetViewPopup: PropTypes.func
}

export default ListingMainContent
