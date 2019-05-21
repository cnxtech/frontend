import {Component} from 'react'
import PropTypes from 'prop-types'
import {Query, ApolloConsumer} from 'react-apollo'
import {GET_LISTINGS} from 'graphql/listings/queries'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import Link from 'next/link'
import differenceBy from 'lodash/differenceBy'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import ListingFeedGrid from './Grid'
import {Wrapper, Container, MoreButton} from './styles'

class ListingFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theListings: undefined
    }
  }

  getFeedGrid = (listings, favorites) => {
    const {currentUser, button, title} = this.props
    const {theListings} = this.state

    return (
      (listings || theListings) && (
        <ListingFeedGrid
          title={title}
          listings={listings || theListings}
          favorites={favorites || []}
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
    )
  }

  getServerListings = () => {
    const {variables} = this.props
    return (
      <Query
        query={GET_LISTINGS}
        variables={variables}
        fetchPolicy="cache-and-network"
        ssr={true}
      >
        {({error, data}) => {
          if (!data) {
            return null
          }
          if (error) {
            return `Error!: ${error}`
          }
          const listings = data ? data.listings : null
          return this.getUserListingsActions(listings)
        }}
      </Query>
    )
  }
  getUserListingsActions = (result) => {
    const {currentUser, variables} = this.props

    if (result && result.listings.length > 0) {
      return (
        <Query
          query={GET_USER_LISTINGS_ACTIONS}
          ssr={true}
          skip={!currentUser.authenticated}
          variables={variables}
        >
          {(data) => {
            const userProfile = data ? data.userProfile : null
            const favorites = userProfile ? userProfile.favorites : []
            const filteredListings = differenceBy(result.listings, 'id')
            return (
              filteredListings && this.getFeedGrid(filteredListings, favorites)
            )
          }}
        </Query>
      )
    }
  }

  loadListings = async (client) => {
    const {variables} = this.props
    const {theListings} = this.state
    const {data} = await client.query({
      query: GET_LISTINGS,
      variables: variables
    })
    if (!theListings && data && data.listings) {
      this.setState({theListings: data.listings.listings})
    }
  }

  getClientListings = () => {
    const {theListings} = this.state
    return (
      <ApolloConsumer>
        {(client) => {
          this.loadListings(client)
          return theListings && this.getFeedGrid()
        }}
      </ApolloConsumer>
    )
  }

  render() {
    const {client, highlight, title} = this.props
    return (
      <Wrapper highlight={highlight}>
        <Container>
          <Text as="h3" color="grey" fontWeight="bold">
            {title}
          </Text>
          {client ? this.getClientListings() : this.getServerListings()}
        </Container>
      </Wrapper>
    )
  }
}

ListingFeed.propTypes = {
  client: PropTypes.bool,
  highlight: PropTypes.bool,
  title: PropTypes.string,
  button: PropTypes.object,
  currentUser: PropTypes.object,
  variables: PropTypes.object
}

export default ListingFeed
