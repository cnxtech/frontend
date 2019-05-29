import uniqBy from 'lodash/uniqBy'
import React, {Component} from 'react'
import Router from 'next/router'
import {Query, graphql} from 'react-apollo'
import Link from 'next/link'
import {compose, hoistStatics} from 'recompose'
import {HEADER_HEIGHT} from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import FavoritesHeader from 'components/user/FavoritesHeader'
import ListingCard from 'components/listings/shared/ListingCard'
import {GET_USER_INFO, GET_FAVORITE_LISTINGS} from 'graphql/user/queries'
import {createInterest} from 'services/interest-api'
import {getUserInfo} from 'lib/user'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import Map from 'components/listings/shared/ListingsMap'
import ContactSuccess from 'components/listings/show/ContactSuccess'
import {
  log,
  PROFILE_FAVORITES_EXPLORE_LISTINGS,
  PROFILE_FAVORITES_VIEW_LISTING,
  PROFILE_FAVORITES_VIEW_MAP,
  PROFILE_FAVORITES_SCHEDULE_VISIT
} from 'lib/logging'
import {
  CardContainer,
  InitialView,
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

  onResize = () => {
    this.setState({
      height:
        window.innerHeight -
        (this.topBarRef.current.clientHeight + HEADER_HEIGHT)
    })
  }

  isFavorite = ({id}) =>
    Boolean(this.props.listings.find((listing) => listing.id === id))

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

    let identify = new amplitude.Identify().set('name', userInfo.name).set('phone', userInfo.phone)
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

  closeSuccessPostInterestPopup = () => {
    this.setState({isInterestSuccessPopupVisible: false})
  }

  render() {
    const {user} = this.props
    const {listings, height, view, isInterestSuccessPopupVisible, isLoading} = this.state
    return (
      <View height={height} width="100vw">
        <FavoritesHeader
          ref={this.topBarRef}
          favorites={this.props.listings || []}
          onClickView={() => {
            this.setState({view: view === VIEW_LIST ? VIEW_MAP : VIEW_LIST}, () => {
              Router.push('/user/favorites', `/meu-perfil/favoritos${this.state.view === VIEW_MAP ? '/mapa' : ''}`, {shallow: true})
              log(this.state.view === VIEW_MAP ? PROFILE_FAVORITES_VIEW_MAP : PROFILE_FAVORITES_VIEW_LISTING)
            })
          }}
          loading={isLoading}
          viewIcon={view === VIEW_LIST ? 'map' : 'th'}
          viewLabel={view === VIEW_LIST ? 'Mapa' : 'Lista'}
          onInterestCreate={this.onSubmit}
        />
        {isInterestSuccessPopupVisible && (
          <ContactSuccess
            onClose={this.closeSuccessPostInterestPopup}
            currentUser={this.props.currentUser}
          />
        )}
        <Query query={GET_FAVORITE_LISTINGS}>
          {({loading, error, data}) => {
            if (loading) return <div />
            if (error) return `Error!: ${error}`
            const userProfile = data ? data.userProfile : null
            if (userProfile.favorites.length > 0) {
              if (view === VIEW_LIST) {
                return (
                  <CardContainer>
                    <ProfileList
                      width="100%"
                      flexWrap="wrap"
                      justifyContent="space-between"
                    >
                      {userProfile.favorites.map((listing) => {
                        return (
                          <ListingCard
                            key={listing.id}
                            listing={listing}
                            currentUser={user}
                            loading={loading}
                            favorited={userProfile.favorites || []}
                          />
                        )
                      })}
                    </ProfileList>
                  </CardContainer>
                )
              } else {
                return (
                  <Map
                    user={user}
                    data={listings}
                    isFavorite={this.isFavorite}
                    getInitialFrame={({markers}) => markers}
                  />
                )
              }
            } else {
              return (
                <InitialView>
                  <Row
                    justifyContent="center"
                    alignItems="center"
                    py={5}
                  >
                    <HeartContainer>
                      <HeartIcon name="heart" />
                    </HeartContainer>
                  </Row>
                  <Text textAlign="center">Navegue pelos imóveis e salve os seus preferidos clicando no ícone do coração.</Text>
                  <Text textAlign="center">Eles ajudam os especialistas de vendas a entenderem melhor o que você procura.</Text>
                  <View margin="auto" mt={4}>
                    <Link href="/imoveis">
                      <Button
                        active
                        height="tall"
                        onClick={() => {log(PROFILE_FAVORITES_EXPLORE_LISTINGS)}}
                      >
                        Explorar
                      </Button>
                    </Link>
                  </View>
                </InitialView>
              )
            }
          }}
        </Query>
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
