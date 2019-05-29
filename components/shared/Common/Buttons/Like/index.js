import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {captureException} from '@sentry/browser'
import get from 'lodash/get'
import {Mutation} from 'react-apollo'
import Icon from '@emcasa/ui-dom/components/Icon'
import AccountKit from 'components/shared/Auth/AccountKit'
import {FAVORITE_LISTING, UNFAVORITE_LISTING} from 'graphql/listings/mutations'
import {EDIT_PROFILE} from 'graphql/user/mutations'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import FavoriteLogin from './FavoriteLogin'
import FavoriteLoginSuccess from './FavoriteLoginSuccess'
import {
  Circle,
  TextButton
} from './styles'
import {
  log,
  LISTING_SEARCH_FAVORITE_LISTING,
  LISTING_SAVE_LOGIN_OPEN,
  LISTING_SAVE_LOGIN_ACCOUNT_KIT,
  LISTING_SAVE_LOGIN_SUCCESS,
  LISTING_SAVE_LOGIN_FAILED,
  LISTING_SAVE_LOGIN_DONE,
  LISTING_SAVE_LOGIN_CLOSE
} from 'lib/logging'

class LikeButton extends Component {
  state = {
    name: null,
    showLogin: false,
    showSuccess: false
  }

  onLoginSuccess = async (userInfo, favoriteListing) => {
    if (!userInfo) {
      log(LISTING_SAVE_LOGIN_FAILED)
      return
    }

    try {
      const id = get(userInfo, 'data.accountKitSignIn.user.id', null)
      if (!id) {
        throw new Error('User ID not found after authentication')
      }

      const name = this.state.name
      if (name) {
        const response = await apolloClient.mutate({
          mutation: EDIT_PROFILE,
          variables: {
            id: id,
            name
          }
        })
      }

      log(LISTING_SAVE_LOGIN_SUCCESS)
      favoriteListing({refetchQueries: [{query: GET_USER_LISTINGS_ACTIONS}], variables: {id: this.props.listing.id}})
      this.setState({showSuccess: true})
    } catch (e) {
      captureException(e)
      log(LISTING_SAVE_LOGIN_FAILED)
    }
  }

  render() {
    const {favorite, top, user, listing, textButton} = this.props
    const ButtonContainer = textButton ? TextButton : Circle
    return (
      <Mutation mutation={!favorite ? FAVORITE_LISTING : UNFAVORITE_LISTING}>
        {(favoriteListing) =>
          <>
            {this.state.showLogin && <AccountKit
              appId={process.env.FACEBOOK_APP_ID}
              appSecret={process.env.ACCOUNT_KIT_APP_SECRET}
              version="v1.0"
              onSuccess={(userInfo) => {this.onLoginSuccess(userInfo, favoriteListing)}}
            >
              {({signIn}) =>
                <FavoriteLogin
                  onClose={() => {
                    log(LISTING_SAVE_LOGIN_CLOSE)
                    this.setState({showLogin: false})
                  }}
                  onSignIn={(name) => {
                    this.setState({
                      showLogin: false,
                      name
                    }, () => {
                      log(LISTING_SAVE_LOGIN_ACCOUNT_KIT)
                      signIn()
                    })
                  }}
                  onMount={() => {
                    log(LISTING_SAVE_LOGIN_OPEN)
                  }}
                />
              }
            </AccountKit>}
            {this.state.showSuccess &&
              <FavoriteLoginSuccess
                onClose={() => {
                  this.setState({showSuccess: false})
                  log(LISTING_SAVE_LOGIN_DONE)
                }}
              />
            }
            <ButtonContainer
              aria-label="Favoritar imóvel"
              top={top}
              onClick={(e) => {
                e.preventDefault()
                if (user && user.authenticated) {
                  log(LISTING_SEARCH_FAVORITE_LISTING, {
                    listingId: listing.id,
                    favorited: !favorite
                  })
                  favoriteListing({
                    refetchQueries: [
                      {
                        query: GET_USER_LISTINGS_ACTIONS
                      }
                    ],
                    variables: {
                      id: listing.id
                    },
                    optimisticResponse: {
                      __typename: 'Query',
                      [!favorite ? 'favoriteListing' : 'unfavoriteListing']: {
                        __typename: 'ListingUser',
                        listing: {
                          __typename: 'Listing',
                          id: listing.id
                        }
                      }
                    },
                    update: (proxy) => {
                      // Read the data from our cache for this query.
                      let data = proxy.readQuery({
                        query: GET_USER_LISTINGS_ACTIONS
                      })
                      if (!favorite) {
                        data.userProfile.favorites.push({
                          id: listing.id.toString(),
                          __typename: 'Listing'
                        })
                      } else {
                        const removed = data.userProfile.favorites.filter((item) => item.id.toString() !== listing.id.toString())
                        data.userProfile.favorites = removed
                      }

                      // Write our data back to the cache.
                      proxy.writeQuery({
                        query: GET_USER_LISTINGS_ACTIONS,
                        data
                      })
                    }
                  })
                } else {
                  this.setState({showLogin: true})
                }
              }}
              {...this.props}
            >
              <Icon name="heart" />
            </ButtonContainer>
          </>
        }
      </Mutation>
    )
  }
}

LikeButton.propTypes = {
  favorite: PropTypes.bool,
  top: PropTypes.number,
  user: PropTypes.object,
  listing: PropTypes.object,
  textButton: PropTypes.bool
}

export default LikeButton
