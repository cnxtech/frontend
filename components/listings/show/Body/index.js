import {Component} from 'react'
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
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import Icon from '@emcasa/ui-dom/components/Icon'
import Breakpoint from '@emcasa/ui-dom/components/Breakpoint'
import ListingInfo from './ListingInfo'
import ListingDescription from './ListingDescription'
import DevelopmentPhase from './DevelopmentPhase'
import DevelopmentListings from './DevelopmentListings'
import {Container} from './styles'

class ListingMainContent extends Component {
  componentDidMount() {
    log(LISTING_DETAIL_OPEN, getListingInfoForLogs(this.props.listing))
  }

  onClickDevelopmentListings = () => {}

  onExpandDescription = () => {
    log(
      LISTING_DETAIL_EXPAND_DESCRIPTION,
      getListingInfoForLogs(this.props.listing)
    )
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
    const ownerOrAdmin = canEdit(user, listing)
    const listingUserInfo = ownerOrAdmin
      ? `${street}, ${streetNumber} ${
          listing.complement ? `- ${listing.complement}` : ''
        }`
      : `${street}`
    const description = getParagraphs(listing.description)
    if (listing.development)
      description.push(...getParagraphs(listing.development.description))
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
            {Boolean(listing.development) && (
              <>
                <DevelopmentPhase phase={listing.development.phase} />
                <Breakpoint down="tablet">
                  <a href="#unidades">
                    <Button mt={1} mb={5}>
                      <Row alignItems="center">
                        <Icon name="arrow-down" size={16} mr={2} />
                        <Text inline fontSize="small">
                          Ver unidades disponíveis
                        </Text>
                      </Row>
                    </Button>
                  </a>
                </Breakpoint>
              </>
            )}
            <ListingDescription
              title={`Sobre o ${
                listing.development ? 'empreendimento' : 'imóvel'
              }`}
              address={listing.address}
              tags={listing.tags}
              paragraphs={description}
              onExpand={this.onExpandDescription}
            />
          </View>
        </Container>
        {Boolean(listing.development) && (
          <View id="unidades">
            <DevelopmentListings uuid={listing.development.uuid} />
          </View>
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
