import uniqBy from 'lodash/uniqBy'
import React, {Component} from 'react'
import Router from 'next/router'
import {graphql} from 'react-apollo'
import {compose, hoistStatics} from 'recompose'
import {HEADER_HEIGHT} from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import ListingCard from 'components/listings/shared/ListingCard'
import {GET_USER_INFO, GET_FAVORITE_LISTINGS} from 'graphql/user/queries'
import {createInterest} from 'services/interest-api'
import {getUserInfo} from 'lib/user'
import Map from 'components/listings/shared/ListingsMap'
import ActionsBar from 'components/shared/ActionsBar'
import ContactSuccess from 'components/listings/show/ContactSuccess'
import {
  log,
  PROFILE_FAVORITES_VIEW_LISTING,
  PROFILE_FAVORITES_VIEW_MAP,
  PROFILE_FAVORITES_SCHEDULE_VISIT
} from 'lib/logging'
import {
  CardContainer,
  NoListingsContainer,
  ProfileList,
  HeartContainer,
  HeartIcon
} from './styles'

const VIEW_LIST = 'list'
const VIEW_MAP = 'map'

class UserFavorites extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listings: this.props.listings || [],
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      view: props.initialView === VIEW_MAP ? VIEW_MAP : VIEW_LIST,
      isInterestSuccessPopupVisible: false,
      isLoading: false
    }
    this.topBarRef = React.createRef()
  }

  static async getInitialProps({query}) {
    return {
      renderFooter: false,
      initialView: query.initialView || VIEW_LIST
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.listings && this.props.listings !== prevProps.listings) {
      // Keep unfavorited listing cards mounted
      this.setState(({listings}) => ({
        listings: uniqBy([...listings, ...this.props.listings], 'id')
      }))
    }
  }

  componentDidMount() {
    if (!this.props.currentUser) {
      Router.push('/')
      return
    }
    window.addEventListener('resize', this.onResize)
    this.onResize()

    const {initialView} = this.props
    this.setState({view: initialView})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  onSwitchView = () => {
    const {view} = this.state
    this.setState({view: view === VIEW_LIST ? VIEW_MAP : VIEW_LIST}, () => {
      Router.push(
        '/user/favorites',
        `/meu-perfil/favoritos${view === VIEW_MAP ? '/mapa' : ''}`,
        {shallow: true}
      )
      log(
        this.state.view === VIEW_MAP
          ? PROFILE_FAVORITES_VIEW_MAP
          : PROFILE_FAVORITES_VIEW_LISTING
      )
    })
  }

  onResize = () => {
    this.setState({
      height:
        window.innerHeight -
        (this.topBarRef.current.clientHeight + HEADER_HEIGHT)
    })
  }

  onSubmit = async () => {
    this.setState({isLoading: true})

    const {currentUser} = this.props
    const userInfo = await getUserInfo(currentUser.id)
    if (!userInfo || !userInfo.phone) {
      this.setState({isLoading: false})
      return
    }

    const {listings} = this.props
    if (!listings || listings.length === 0) {
      this.setState({isLoading: false})
      return
    }

    const listing = listings[0]
    const {id} = listing

    const res = await createInterest(id, {
      name: userInfo.name,
      phone: userInfo.phone
    })

    let identify = new amplitude.Identify()
      .set('name', userInfo.name)
      .set('phone', userInfo.phone)
    amplitude.identify(identify)

    if (res && res.data && res.data.errors) {
      this.setState({
        errors: res.data.errors,
        isLoading: false
      })
      return
    }

    log(PROFILE_FAVORITES_SCHEDULE_VISIT, {listingId: id})
    this.setState({
      isInterestSuccessPopupVisible: true,
      isLoading: false
    })
  }

  isFavorite = ({id}) =>
    Boolean(this.props.listings.find((listing) => listing.id === id))

  closeSuccessPostInterestPopup = () => {
    this.setState({isInterestSuccessPopupVisible: false})
  }

  renderEmpty() {
    return (
      <NoListingsContainer>
        <Row justifyContent="center" alignItems="center" py={5} mx={4}>
          <HeartContainer>
            <HeartIcon name="heart" />
          </HeartContainer>
        </Row>
        <Text textAlign="center">
          Navegue pelos imóveis e salve os seus preferidos clicando no ícone do
          coração.
        </Text>
        <Text textAlign="center">
          Eles ajudam os especialistas de vendas a entenderem melhor o que você
          procura.
        </Text>
      </NoListingsContainer>
    )
  }

  renderList() {
    const {user, loading} = this.props
    const {listings} = this.state
    return (
      <CardContainer>
        <ProfileList
          width="100%"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {listings.map((listing) => {
            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                currentUser={user}
                loading={loading}
                favorited={listings}
              />
            )
          })}
        </ProfileList>
      </CardContainer>
    )
  }

  renderMap() {
    const {user} = this.props
    const {listings} = this.state
    return (
      <Map
        user={user}
        data={listings}
        isFavorite={this.isFavorite}
        getInitialFrame={({markers}) => markers}
      />
    )
  }

  render() {
    const {user, loading} = this.props
    const {listings, height, view, isInterestSuccessPopupVisible} = this.state
    return (
      <View height={height} width="100vw">
        <View ref={this.topBarRef}>
          <ActionsBar
            isFavoritesPage
            user={user}
            button={
              <ActionsBar.Button
                icon={this.state.view === VIEW_MAP ? 'th' : 'map'}
                label={this.state.view === VIEW_MAP ? 'Lista' : 'Mapa'}
                onClick={this.onSwitchView}
              />
            }
          />
          <Row
            flexDirection={['column', null, null, 'row']}
            justifyContent="space-between"
            alignItems="center"
            p={4}
          >
            {listings.length === 0 ? (
              <Text inline fontSize="small">
                Você ainda não tem nenhum imóvel em Favoritos.
              </Text>
            ) : (
              <Text inline fontSize="small">
                Você tem{' '}
                <Text inline color="pink" fontSize="small">
                  {listings.length}
                </Text>{' '}
                {listings.length === 1 ? 'imóvel salvo.' : 'imóveis salvos.'}
              </Text>
            )}
            <Row width={['100%', null, null, 'auto']} mt={[2, null, null, 0]}>
              <Button
                active
                flex={1}
                fontSize="small"
                fontWeight="bold"
                disabled={listings.length === 0 || loading}
                onClick={this.onSubmit}
              >
                Falar com especialista
              </Button>
            </Row>
          </Row>
        </View>
        {isInterestSuccessPopupVisible && (
          <ContactSuccess
            onClose={this.closeSuccessPostInterestPopup}
            currentUser={this.props.currentUser}
          />
        )}
        {loading
          ? this.renderLoading()
          : !listings.length
            ? this.renderEmpty()
            : view === VIEW_LIST ? this.renderList() : this.renderMap()}
      </View>
    )
  }
}

export default hoistStatics(
  compose(
    graphql(GET_USER_INFO, {
      skip: ({user}) => !user.id,
      options: ({user}) => ({
        ssr: true,
        variables: {id: user.id}
      }),
      props: ({ownProps, data, loading}) => ({
        loading,
        currentUser: data ? data.userProfile : ownProps.currentUser
      })
    }),
    graphql(GET_FAVORITE_LISTINGS, {
      skip: ({user}) => !user.id,
      options: ({user}) => ({
        ssr: true,
        variables: {id: user.id}
      }),
      props: ({data, loading}) => ({
        loading,
        listings: data && data.userProfile ? data.userProfile.favorites : []
      })
    })
  )
)(UserFavorites)
