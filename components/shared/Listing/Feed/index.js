import {Component} from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import {GET_LISTINGS} from 'graphql/listings/queries'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import Link from 'next/link'
import ListingFeedGrid from './Grid'
import {Wrapper, MoreButton} from './styles'
import Row from '@emcasa/ui-dom/components/Row'
import differenceBy from 'lodash/differenceBy'

class ListingFeed extends Component {
  getListings = (result, loading) => {
    const {currentUser, button, variables, title} = this.props

    if (result && result.listings.length > 0) {
      return (
        <Query
          query={GET_USER_LISTINGS_ACTIONS}
          ssr={true}
          skip={!currentUser.authenticated}
          variables={variables}
        >
          {({data, loading}) => {
            if (loading) {
              return <div />
            }
            const userProfile = data ? data.userProfile : null
            const favorites = userProfile ? userProfile.favorites : []
            const filteredListings = differenceBy(result.listings, 'id')
            return (
              <ListingFeedGrid
                title={title}
                listings={filteredListings}
                favorites={favorites}
                currentUser={currentUser}
              >
                <Row mt={5}>
                  <Link passHref href={button.href} as={button.as} passHref>
                    <MoreButton
                      fontSize={1}
                      as="a"
                      onClick={button.click ? button.click : null}
                    >
                      {button.label}
                    </MoreButton>
                  </Link>
                </Row>
              </ListingFeedGrid>
            )
          }}
        </Query>
      )
    }
  }

  render() {
    const {variables, highlight} = this.props
    return (
      <Query
        query={GET_LISTINGS}
        variables={variables}
        fetchPolicy="cache-and-network"
        ssr={true}
      >
        {({error, data, loading}) => {
          if (!data) {
            return null
          }
          if (error) {
            return `Error!: ${error}`
          }
          const listings = data ? data.listings : null
          return (
            <Wrapper highlight={highlight}>
              {this.getListings(listings, loading)}
            </Wrapper>
          )
        }}
      </Query>
    )
  }
}

ListingFeed.propTypes = {
  highlight: PropTypes.bool,
  title: PropTypes.string,
  button: PropTypes.object,
  currentUser: PropTypes.object,
  variables: PropTypes.object,
}

export default ListingFeed
