import uniqBy from 'lodash/uniqBy'
import React, {PureComponent} from 'react'
import Router from 'next/router'
import {graphql} from 'react-apollo'
import {compose, hoistStatics} from 'recompose'
import {HEADER_HEIGHT} from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import FavoritesHeader from 'components/user/FavoritesHeader'
import Map from 'components/listings/shared/ListingsMap'

import {GET_USER_INFO, GET_FAVORITE_LISTINGS} from 'graphql/user/queries'

class UserFavoritesMap extends PureComponent {
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
            Router.push('/user/favorites', '/meu-perfil/favoritos')
          }
          viewIcon="th"
          viewLabel="Lista"
        />
        <Map
          user={user}
          data={listings}
          isFavorite={this.isFavorite}
          getInitialFrame={({markers}) => markers}
        />
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
)(UserFavoritesMap)
