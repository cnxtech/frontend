import '@emcasa/ui-dom/components/global-styles'
import {Component, Fragment} from 'react'
import {Query} from 'react-apollo'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import {
  GET_FULL_LISTING,
  GET_DISTRICTS
} from 'graphql/listings/queries'
import {Mutation} from 'react-apollo'
import {
  FAVORITE_LISTING,
  VISUALIZE_TOUR
} from 'graphql/listings/mutations'
import {isAuthenticated, isAdmin, getCurrentUserId, getJwt} from 'lib/auth'
import {getRelatedListings} from 'services/listing-api'
import Link from 'next/link'
import {createInterest} from 'services/interest-api'
import isUndefined from 'lodash/isUndefined'
import ListingHead from 'components/listings/show/Head'
import ListingSlider from 'components/listings/show/ListingSlider'
import ListingMainContent from 'components/listings/show/Body'
import Breadcrumb from 'components/listings/show/Breadcrumb'
import PriceBar from 'components/listings/show/PriceBar'
import ButtonsBar from 'components/listings/show/ButtonsBar'
import MatterportPopup from 'components/listings/show/MatterportPopup'
import MapPopup from 'components/listings/show/MapPopup'
import ContactForm from 'components/listings/show/ContactForm'
import ContactSuccess from 'components/listings/show/ContactSuccess'
import RelatedListings from 'components/listings/show/RelatedListings'
import Warning from 'components/shared/Common/Warning'
import {buildSlug, getListingId} from 'lib/listings'
import NextHead from 'components/shared/NextHead'
import getApolloClient from 'lib/apollo/initApollo'
import {getUserInfo} from 'lib/user'
import {getCookie} from 'lib/session'
import {
  fetchFlag,
  DEVICE_ID_COOKIE
} from 'components/shared/Flagr'
import {TEST_SCHEDULE_VISIT_CTA} from 'components/shared/Flagr/tests'
import {
  log,
  getListingInfoForLogs,
  LISTING_DETAIL_CANCEL_VISIT_FORM,
  LISTING_DETAIL_CLOSE_VISIT_FORM,
  LISTING_DETAIL_OPEN_VISIT_FORM,
  LISTING_DETAIL_SCHEDULE_VISIT,
  LISTING_DETAIL_MATTERPORT_OPEN,
  LISTING_DETAIL_MATTERPORT_CLOSE,
  LISTING_DETAIL_MAP_OPEN,
  LISTING_DETAIL_MAP_CLOSE,
  LISTING_DETAIL_STREETVIEW_OPEN,
  LISTING_DETAIL_STREETVIEW_CLOSE
} from 'lib/logging'
import {listingDetailsBarHeight} from 'constants/dimensions'
import {captureException} from '@sentry/browser'


class Listing extends Component {
  favMutated = false
  state = {
    isInterestPopupVisible: false,
    isInterestSuccessPopupVisible: false,
    isMatterportPopupVisible: false,
    isMapPopupVisible: false,
    isStreetViewPopupVisible: false,
    userName: null,
    userPhone: null
  }

  static async getInitialProps(context) {
    const {asPath, res} = context
    const id = getListingId(asPath)

    const currentUser = {
      id: getCurrentUserId(context),
      admin: isAdmin(context),
      authenticated: isAuthenticated(context),
      jwt: getJwt(context)
    }

    const apolloClient = getApolloClient(undefined, getJwt(context))

    const serverResponse = await apolloClient.query({
      query: GET_FULL_LISTING,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        id
      }
    })

    const listing = serverResponse.data.listing
    const errors = serverResponse.errors

    // Flagr
    const deviceId = getCookie(DEVICE_ID_COOKIE, context.req)
    const flagrFlags = {
      [TEST_SCHEDULE_VISIT_CTA]: await fetchFlag(TEST_SCHEDULE_VISIT_CTA, deviceId)
    }

    if (listing) {
      if (asPath && res) {
        const urlParams = asPath.split('/').length
        //If client is trying to access old slugs then redirect
        if (urlParams <= 3 || urlParams === 5) {
          res.redirect(301, buildSlug(listing))
        }
      }

      return {
        listing,
        currentUser,
        flagrFlags
      }
   } else {
      return {
        listingFetchError: errors[0],
        currentUser,
        flagrFlags
      }
    }
  }

  openMatterportPopup = () => {
    const {listing: {id}} = this.props

    if (this.visualizeTour) {
      this.visualizeTour({variables: {id}})
    }

    log(LISTING_DETAIL_MATTERPORT_OPEN, {listingId: id})
    this.setState({isMatterportPopupVisible: true})
  }

  closeMatterportPopup = () => {
    log(LISTING_DETAIL_MATTERPORT_CLOSE, {listingId: this.props.listing.id})
    this.setState({isMatterportPopupVisible: false})
  }

  openMapPopup = () => {
    log(LISTING_DETAIL_MAP_OPEN)
    this.setState({isMapPopupVisible: true})
  }

  closeMapPopup = () => {
    log(LISTING_DETAIL_MAP_CLOSE)
    this.setState({isMapPopupVisible: false})
  }

  openStreetViewPopup = () => {
    log(LISTING_DETAIL_STREETVIEW_OPEN)
    this.setState({isStreetViewPopupVisible: true})
  }

  closeStreetViewPopup = () => {
    log(LISTING_DETAIL_STREETVIEW_CLOSE)
    this.setState({isStreetViewPopupVisible: false})
  }

  openInterestPopup = async (e) => {
    const {currentUser} = this.props
    if (currentUser && currentUser.authenticated) {
      const userInfo = await getUserInfo(currentUser.id)
      if (userInfo && userInfo.name && userInfo.phone) {
        this.onSubmit(e, userInfo)
        return
      }
    }
    if (!this.state.isInterestPopupVisible) {
      log(LISTING_DETAIL_OPEN_VISIT_FORM, getListingInfoForLogs(this.props.listing))
    }
    this.setState({isInterestPopupVisible: true})
  }

  closeInterestPopup = () => {
    log(LISTING_DETAIL_CANCEL_VISIT_FORM)
    this.setState({isInterestPopupVisible: false})
  }

  closeSuccessPostInterestPopup = () => {
    log(LISTING_DETAIL_CLOSE_VISIT_FORM)
    this.setState({isInterestSuccessPopupVisible: false})
  }

  onSubmit = async (e, userInfo) => {
    e && e.preventDefault()

    const {id} = this.props.listing
    const {listing} = this.props

    const res = await createInterest(id, {name: userInfo.name, phone: userInfo.phone})

    if (res.data.errors) {
      this.setState({errors: res.data.errors})
      return
    }

    log(LISTING_DETAIL_SCHEDULE_VISIT, getListingInfoForLogs(listing))

    if (!res.data) {
      return res
    }

    this.setState({
      isInterestPopupVisible: false,
      isInterestSuccessPopupVisible: true,
      userName: userInfo.name,
      userPhone: userInfo.phone
    })
  }

  async componentDidMount() {
    const {listing} = this.props

    this.checkListing(listing)

    if (listing && listing.id) {
      const related = await getRelatedListings(listing.id).then(({data}) => data.listings)
      this.setState({related})
    }
  }

  showListing = () => {
    const {user: currentUser, url, listing, router} = this.props
    const {related, isMatterportPopupVisible, isMapPopupVisible, isStreetViewPopupVisible} = this.state
    const {isActive} = listing

    const {
      isInterestPopupVisible,
      isInterestSuccessPopupVisible
   } = this.state

    const roomInformationForPath = listing.rooms
      ? ` de ${listing.rooms} dormitórios`
      : ''

    const {neighborhood, neighborhoodSlug} = listing.address

    const paths = [
      {name: 'Comprar Imóveis', href: '/listings', as: '/imoveis'},
      {
        name: neighborhood,
        href: `/listings?bairros=${neighborhoodSlug}`,
        as: `/imoveis?bairros=${neighborhoodSlug}`
      },
      {
        name: listing.type + roomInformationForPath,
        href: `/listings?bairros=${
          neighborhoodSlug
        }&quartos_minimo=${listing.rooms}`,
        as: `/imoveis?bairros=${neighborhoodSlug}&quartos_minimo=${
          listing.rooms
        }&quartos_maximo=${listing.rooms}`
      },
      {name: 'Este imóvel'}
    ]

    return (
      <Mutation mutation={FAVORITE_LISTING}>
        {(favoriteListing) => (
          <Query
            query={GET_USER_LISTINGS_ACTIONS}
            skip={!currentUser.authenticated}
            ssr={true}
          >
            {({data, loading, error}) => {
              const userProfile = data ? data.userProfile : null
              const {router} = this.props
              const favorite =
                !loading &&
                !error &&
                userProfile &&
                userProfile.favorites &&
                userProfile.favorites.filter(
                  (listingSaved) =>
                    listingSaved.id.toString() === listing.id.toString()
                ).length > 0
              if (
                !isUndefined(router.query.f) &&
                !loading &&
                !favorite &&
                !this.favMutated
              ) {
                this.favMutated = true
                favoriteListing({
                  refetchQueries: [
                    {
                      query: GET_USER_LISTINGS_ACTIONS
                    }
                  ],
                  variables: {
                    id: listing.id
                  }
                })
              }
              return (
                <Fragment>
                  <ListingHead
                    listing={listing}
                    routerAsPath={router.asPath}
                  />
                  <Row flexDirection={['column-reverse', null, null, 'column']} mt={[null, null, null, `${listingDetailsBarHeight}px`]}>
                    <Breadcrumb paths={paths} />
                    <Row flexDirection="column">
                      <ListingSlider
                        listing={listing}
                        currentUser={currentUser}
                        favoritedListing={{loading, favorite}}
                      />
                      {!isActive && (
                        <Warning green={url.query.r}>
                          {url.query.r ? (
                            <p>
                              <b>Pré-cadastro feito com sucesso.</b> Nossa equipe
                              entrará em contato via email.
                            </p>
                          ) : (
                            <p>
                              Imóvel não está visível para o público pois está em
                              fase de moderação.
                            </p>
                          )}
                        </Warning>
                      )}
                      <PriceBar
                        type={listing.type}
                        price={listing.price}
                      />
                      <ListingMainContent
                        listing={listing}
                        user={currentUser}
                        favorite={favorite}
                        flagrFlags={this.props.flagrFlags}
                        openMatterportPopup={this.openMatterportPopup}
                        openMapPopup={this.openMapPopup}
                        openStreetViewPopup={this.openStreetViewPopup}
                      />

                      <Mutation mutation={VISUALIZE_TOUR}>
                        {(visualizeTour) => {
                          if (!this.visualizeTour) {
                            this.visualizeTour = visualizeTour
                          }
                          return (
                            <MatterportPopup
                              listing={listing}
                              isMatterportPopupVisible={isMatterportPopupVisible}
                              closeMatterportPopup={this.closeMatterportPopup}
                            />
                          )
                        }}
                      </Mutation>
                      <MapPopup
                        listing={listing}
                        isMapPopupVisible={isMapPopupVisible}
                        closeMapPopup={this.closeMapPopup}
                      />
                      <MapPopup
                        streetView
                        listing={listing}
                        isMapPopupVisible={isStreetViewPopupVisible}
                        closeMapPopup={this.closeStreetViewPopup}
                      />
                      <ButtonsBar
                        handleOpenInterestPopup={this.openInterestPopup}
                        favorite={favorite}
                        listing={listing}
                        user={currentUser}
                      />
                      <RelatedListings
                        currentUser={currentUser}
                        listings={related}
                      />
                    </Row>
                    {isInterestPopupVisible && (
                      <ContactForm
                        onClose={this.closeInterestPopup}
                        onSubmit={this.onSubmit}
                      />
                    )}
                    {isInterestSuccessPopupVisible && (
                      <ContactSuccess
                        onClose={this.closeSuccessPostInterestPopup}
                        listing={listing}
                        userInfo={{name: this.state.userName, phone: this.state.userPhone}}
                      />
                    )}
                  </Row>
                </Fragment>
              )
            }}
          </Query>
        )}
      </Mutation>
    )
  }

  showListingFetchError = (listingFetchError, asPath) => {
    const location = asPath.split('/')
    const state = location[1]
    const city = location[2]
    const neighborhood = location[3]

    return (
      <Query query={GET_DISTRICTS}>
        {({loading, error, data}) => {
          if (loading) return (<div/>)
          if (error || !data || !data.districts) return `Error! ${error.message}`

          const districts = data.districts
          const findState = districts.find(a => a.stateSlug === state)
          const findCity = districts.find(a => a.citySlug === city)
          const findNeighborhood = districts.find(a => a.nameSlug === neighborhood)
          let errorTitle = 'Este imóvel não está mais disponível!'
          let endQuestion = 'de imóveis'
          let buttonLabel = 'Explorar imóveis'
          let buttonHref = '/imoveis'

          if (findNeighborhood) {
            endQuestion = ` em ${findNeighborhood.name}, ${findNeighborhood.city}`
            buttonLabel += ` em ${findNeighborhood.name}`
            buttonHref += `/${findNeighborhood.stateSlug}/${findNeighborhood.citySlug}/${findNeighborhood.nameSlug}`
         } else if (findCity) {
            endQuestion = ` em ${findCity.city}, ${findCity.state}`
            buttonLabel += ` em ${findCity.city}`
            buttonHref += `/${findCity.stateSlug}/${findCity.citySlug}`
         } else if (findState) {
            endQuestion = ` em ${findState.state}`
            buttonLabel += ` em ${findState.state}`
            buttonHref += `/${findState.stateSlug}`
          }

          return (
            <>
              <NextHead title={`Imóvel não encontrado | EmCasa`} />
              <Row
                justifyContent="center"
                px={5}
              >
                <Row
                  flexDirection="column"
                  width={[1,null,null,'768px']}
                >
                  <Text
                    as="h2"
                    textAlign="center"
                    fontSize="xlarge"
                    fontWeight="normal"
                  >
                    {errorTitle}
                  </Text>
                  <Text color="grey">{`Que tal olhar outras opções ${endQuestion}? Separamos alguns imóveis para você! Fique a vontade para dar uma olhada nessa lista`}
                  </Text>
                  <Row justifyContent="center" mt={2}>
                    <Col width={[1,null,null,3/5]}>
                      <Link
                        passHref
                        href={buttonHref}
                      >
                        <a>
                          <Button
                            active
                            fluid
                            height="tall"
                          >
                            {buttonLabel}
                          </Button>
                        </a>
                      </Link>
                    </Col>
                  </Row>
                </Row>
              </Row>
            </>
          )
        }}
      </Query>
    )
  }

  get error() {
    const {listingFetchError} = this.props

    switch (listingFetchError.code || listingFetchError.statusCode) {
      case 404:
        return 'Imóvel não encontrado'
      case 500:
        return 'Internal Server Error'
      default:
        return 'Erro desconhecido'
    }
  }

  checkListing(listing) {
    if (!listing.type) {
      captureException(new Error("Type is null in listing id ", listing.id));
    }
  }

  render() {
    const {listingFetchError, url: {asPath}} = this.props

    return listingFetchError ? (
      this.showListingFetchError(listingFetchError, asPath)
    ) : (
      this.showListing()
    )
  }
}

export default Listing
