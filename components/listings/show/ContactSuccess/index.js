import {Component} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import theme from '@emcasa/ui'
import {Mutation} from 'react-apollo'
import {FAVORITE_LISTING} from 'graphql/listings/mutations'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import Button from '@emcasa/ui-dom/components/Button'
import Modal from 'components/shared/Modal'
import AccountKit from 'components/shared/Auth/AccountKit'
import {
  log,
  LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_BUTTON,
  LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_LOGIN_CANCEL,
  LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_LOGIN_SUCCESS,
  LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_SUCCESS,
  LISTING_DETAIL_VISIT_FORM_VIEW_LISTINGS,
  PROFILE_FAVORITES_VIEW_LISTINGS
} from 'lib/logging'
import {
  GreenBox,
  CheckContainer
} from './styles'

class ContactSuccess extends Component {
  constructor(props) {
    super(props)
  }

  onLoginSuccess = (userInfo, favoriteListing) => {
    if (!userInfo) {
      log(LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_LOGIN_CANCEL, {listingId: this.props.listing.id})
      return
    }
    log(LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_LOGIN_SUCCESS, {listingId: this.props.listing.id})
    this.saveListing(favoriteListing)
  }

  saveListing = (favoriteListing) => {
    try {
      favoriteListing({refetchQueries: [{query: GET_USER_LISTINGS_ACTIONS}], variables: {id: this.props.listing.id}})
      log(LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_SUCCESS, {listingId: this.props.listing.id})
      this.props.onClose()
    } catch (e) {
      captureException(e)
    }
  }

  render() {
    const {listing} = this.props
    const neighborhoodSlug = listing ? listing.address.neighborhoodSlug : null
    const viewListingsHref = neighborhoodSlug ? `/listings?bairros=${neighborhoodSlug}` : '/listings'
    const viewListingsAs = neighborhoodSlug ? `/imoveis?bairros=${neighborhoodSlug}` : '/imoveis'
    return (
      <Modal
        onClose={this.props.onClose}
        closeButtonStyle={{backgroundColor: 'transparent', border: 0}}
        closeIconColor={theme.colors.white}
      >
        <GreenBox>
          <CheckContainer>
            <FontAwesomeIcon icon={faCheck} />
          </CheckContainer>
          <View mt={4} px={4}>
            <Text color="white" fontWeight="bold" textAlign="center">Sucesso! Em breve um especialista entrará em contato com você.</Text>
          </View>
        </GreenBox>
        <Row flexDirection="column" p={4}>
          <Col>
            <Text textAlign="center" fontSize="small">Enquanto isso, salve alguns imóveis. Isso nos ajuda a montar a lista de imóveis perfeita para você.</Text>
          </Col>
          {listing && <Col m="auto" mt={2}>
            <Mutation mutation={FAVORITE_LISTING}>
              {(favoriteListing) =>
                <AccountKit
                  appId={process.env.FACEBOOK_APP_ID}
                  appSecret={process.env.ACCOUNT_KIT_APP_SECRET}
                  version="v1.0"
                  onSuccess={(userInfo) => {this.onLoginSuccess(userInfo, favoriteListing)}}
                  phoneNumber={this.props.userPhone}
                >
                  {({signIn}) => <Button onClick={() => {
                    log(LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_BUTTON, {listingId: this.props.listing.id})
                    const user = this.props.currentUser
                    if (user && user.authenticated) {
                      this.saveListing(favoriteListing)
                    } else {
                      signIn()
                    }
                  }}>Salvar este imóvel</Button>}
                </AccountKit>
              }
            </Mutation>
          </Col>}
          <Col m="auto" mt={2}>
            <Link href={viewListingsHref} as={viewListingsAs}>
              <Button onClick={() => {
                if (listing) {
                  log(LISTING_DETAIL_VISIT_FORM_VIEW_LISTINGS, {listingId: this.props.listing.id})
                } else {
                  log(PROFILE_FAVORITES_VIEW_LISTINGS)
                }
                this.props.onClose()
              }}>Ver outros imóveis</Button>
            </Link>
          </Col>
        </Row>
      </Modal>
    )
  }
}

ContactSuccess.propTypes = {
  onClose: PropTypes.func.isRequired,
  userPhone: PropTypes.string,
  listing: PropTypes.object,
  currentUser: PropTypes.object
}

export default ContactSuccess
