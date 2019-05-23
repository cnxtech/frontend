import {PureComponent} from 'react'
import Router from 'next/router'
import {graphql} from 'react-apollo'
import {compose, hoistStatics} from 'recompose'
import {HEADER_HEIGHT} from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import Map from 'components/listings/shared/ListingsMap'

import {GET_USER_INFO, GET_FAVORITE_LISTINGS} from 'graphql/user/queries'

class UserFavoritesMap extends PureComponent {
  static async getInitialProps() {
    return {
      renderFooter: false
    }
  }

  componentDidMount() {
    if (!this.props.currentUser) {
      Router.push('/')
    }
  }

  render() {
    const {listings = []} = this.props
    return (
      <View height={`calc(100vh - ${HEADER_HEIGHT}px)`} width="100vw">
        <Map data={listings} getInitialFrame={({markers}) => markers} />
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
