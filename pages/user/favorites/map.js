import uniqBy from 'lodash/uniqBy'
import {PureComponent} from 'react'
import Router from 'next/router'
import {graphql} from 'react-apollo'
import {compose, hoistStatics} from 'recompose'
import {HEADER_HEIGHT} from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import Map from 'components/listings/shared/ListingsMap'

import {GET_USER_INFO, GET_FAVORITE_LISTINGS} from 'graphql/user/queries'

class UserFavoritesMap extends PureComponent {
  state = {
    listings: this.props.listings || []
  }

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
    }
  }

  isFavorite = ({id}) =>
    Boolean(this.props.listings.find((listing) => listing.id === id))

  render() {
    const {user} = this.props
    const {listings} = this.state
    return (
      <View height={`calc(100vh - ${HEADER_HEIGHT}px)`} width="100vw">
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
