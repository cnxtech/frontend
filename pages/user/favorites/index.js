import uniqBy from 'lodash/uniqBy'
import React, {PureComponent} from 'react'
import Router from 'next/router'
import {Query, Mutation, graphql} from 'react-apollo'
import Link from 'next/link'
import {compose, hoistStatics} from 'recompose'
import {HEADER_HEIGHT} from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import FavoritesHeader from 'components/user/FavoritesHeader'
import ListingCard from 'components/listings/shared/ListingCard'
import {GET_USER_INFO, GET_FAVORITE_LISTINGS} from 'graphql/user/queries'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import {
  log,
  PROFILE_FAVORITES_EXPLORE_LISTINGS
} from 'lib/logging'
import {
  CardContainer,
  InitialView,
  ProfileList,
  Icon
} from './styles'

class UserFavorites extends PureComponent {
  state = {
    listings: this.props.listings || [],
    height: `calc(100vh - ${HEADER_HEIGHT}px)`
  }

  topBarRef = React.createRef()

  static async getInitialProps() {
    return {
      renderFooter: false
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

  render() {
    const {user} = this.props
    const {listings, height} = this.state
    return (
      <View height={height} width="100vw">
        <FavoritesHeader
          ref={this.topBarRef}
          favorites={this.props.listings || []}
          onClickView={() =>
            Router.push('/user/favorites/map', '/meu-perfil/favoritos/mapa')
          }
          viewIcon="map"
          viewLabel="Mapa"
        />
        <Query query={GET_FAVORITE_LISTINGS}>
          {({loading, error, data}) => {
            if (loading) return <div />
            if (error) return `Error!: ${error}`
            const userProfile = data ? data.userProfile : null
            if (userProfile.favorites.length > 0) {
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
                <InitialView maxWidth="440px">
                  <Col
                    width="100%"
                    alignItems="center"
                  >
                    <Text
                      textAlign="center"
                      fontSize="large"
                      fontWeight="bold"
                    >Você não cadastrou nenhum imóvel</Text>
                    <Row
                      justifyContent="center"
                      py={5}
                    >
                      <Icon icon="/static/svg-icons/happy-face-favorite.svg"/>
                    </Row>
                    <Text
                      textAlign="center"
                      color="gray"
                    >Navegue pelos nosso imóveis e dê um coração para os que você mais gostar. Esses imóveis ficarão salvos aqui nessa lista para você ver e rever quando quiser.</Text>
                    <Link href="/imoveis">
                      <Button
                        active
                        fluid
                        height="tall"
                        onClick={() => {log(PROFILE_FAVORITES_EXPLORE_LISTINGS)}}
                      >Explorar</Button>
                    </Link>
                  </Col>
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
