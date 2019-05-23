import {Component, Fragment} from 'react'
import {Query} from 'react-apollo'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import {
  GET_LISTINGS,
  GET_LISTING,
  GET_LISTINGS_COORDINATES
} from 'graphql/listings/queries'
import differenceBy from 'lodash/differenceBy'
import map from 'lodash/map'
import InfiniteScroll from 'components/shared/InfiniteScroll'
import Listing from 'components/listings/shared/Listing'
import Map from 'components/listings/shared/Map'
import ListingsNotFound from 'components/listings/shared/NotFound'
import Neighborhood from 'components/listings/shared/Neighborhood'
import Container, {
  MapButton,
  MapContainer,
  ListingsContainer,
  Loading
} from './styles'
export default class Listings extends Component {
  constructor(props) {
    super(props)

    this.pagination = {
      pageSize: 10,
      excludedListingIds: []
    }

    this.state = {
      mapOpened: false
    }
  }

  getListings = (result, fetchMore) => {
    const {
      user,
      query,
      resetFilters,
      filters,
      onHoverListing,
      onLeaveListing,
      highlight,
      neighborhoodListener
    } = this.props
    const {mapOpened} = this.state

    const h1Content =
      'Apartamentos e Casas à venda na Zona Sul do Rio de Janeiro'

    if (result && result.listings.length > 0) {
      return (
        <Query query={GET_USER_LISTINGS_ACTIONS} skip={!user.authenticated}>
          {({data, loading}) => {
            if (loading) {
              return <div />
            }
            const userProfile = data ? data.userProfile : null
            const favorites = userProfile ? userProfile.favorites : []
            const filteredListings = differenceBy(result.listings, 'id')
            return (
              <InfiniteScroll
                title={h1Content}
                titleComponent={
                  query.neighborhoodSlug && (
                    <Neighborhood
                      neighborhood={query.neighborhoodSlug}
                      state={query.state}
                      city={query.city}
                      neighborhoodListener={neighborhoodListener}
                    />
                  )
                }
                entries={filteredListings}
                remaining_count={result.remainingCount}
                onLoad={async () => {
                  const loadedListings = await fetchMore({
                    variables: {
                      pagination: {
                        ...this.pagination,
                        excludedListingIds: map(result.listings, 'id')
                      }
                    },
                    updateQuery: (
                      prev,
                      {fetchMoreResult, variables: {pagination}}
                    ) => {
                      if (!fetchMoreResult) return prev
                      this.pagination = pagination
                      const result = {
                        ...prev,
                        listings: {
                          ...prev.listings,
                          remainingCount:
                            fetchMoreResult.listings.remainingCount,
                          listings: [
                            ...prev.listings.listings,
                            ...fetchMoreResult.listings.listings
                          ]
                        }
                      }
                      return result
                    }
                  })

                  return loadedListings
                }}
                horizontal={mapOpened}
              >
                {(listing) => (
                  <Listing
                    onMouseEnter={onHoverListing}
                    onMouseLeave={onLeaveListing}
                    highlight={highlight}
                    key={listing.id}
                    listing={listing}
                    currentUser={user}
                    loading={loading}
                    resumedInfo={mapOpened}
                    favorited={favorites || []}
                  />
                )}
              </InfiniteScroll>
            )
          }}
        </Query>
      )
    } else {
      return (
        <ListingsNotFound
          filters={this.props.filters}
          params={this.props.params}
        />
      )
    }
  }

  loadListing = async (id) => {
    const {apolloClient, filters} = this.props
    const footer = document.querySelector('.infinite-scroll-footer')
    footer && footer.scrollIntoView({block: 'end', behavior: 'smooth'})

    const loadedListings = apolloClient.readQuery({
      query: GET_LISTINGS,
      variables: {pagination: this.pagination, filters}
    })

    const {data} = await apolloClient.query({
      query: GET_LISTING,
      variables: {
        id
      }
    })

    const updatedQueryResult = {
      ...loadedListings,
      listings: {
        ...loadedListings.listings,
        remainingCount: loadedListings.listings.remainingCount - 1,
        listings: [...loadedListings.listings.listings, data.listing]
      }
    }

    apolloClient.writeQuery({
      query: GET_LISTINGS,
      variables: {pagination: this.pagination, filters},
      data: updatedQueryResult
    })
    const element = document.querySelector(
      `[aria-label=listing-${data.listing.id}]`
    )
    element && element.scrollIntoView({block: 'end', behavior: 'smooth'})
  }

  onSelectListing = (id, position) => {
    if (!position) {
      const element = document.querySelector(`[aria-label=listing-${id}]`)

      if (!element) {
        this.loadListing(id)
        return
      }

      element.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
  }

  onHoverListing = (listing) => {
    const {address: {lat, lng}} = listing
    this.setState({highlight: {lat, lng}})
  }

  onLeaveListing = () => {
    this.setState({highlight: {}})
  }

  onChangeMap = (framedListings, {sw, ne}) => {
    const filters = {
      ...this.state.filters,
      minLat: sw.lat,
      minLng: sw.lng,
      maxLat: ne.lat,
      maxLng: ne.lng
    }

    this.setState({filters})
  }

  handleMap = () => {
    const {mapOpened} = this.state
    this.setState({mapOpened: !mapOpened})
  }

  getMap = () => {
    const {highlight, mapOpened} = this.state
    const {filters} = this.props

    return (
      <Query query={GET_LISTINGS_COORDINATES} variables={{filters}}>
        {({data: {listings: mapListings}}) => (
          <Fragment>
            <MapButton opened={mapOpened} onClick={this.handleMap} />
            <MapContainer opened={mapOpened}>
              {process.browser ? (
                <Map
                  zoom={13}
                  onSelect={this.onSelectListing}
                  listings={mapListings.listings}
                  highlight={highlight}
                  onChange={this.onChangeMap}
                  updateAfterApiCall
                />
              ) : (
                <Loading>Carregando mapa...</Loading>
              )}
            </MapContainer>
          </Fragment>
        )}
      </Query>
    )
  }

  render() {
    const {mapOpened} = this.state
    const {filters} = this.props

    return (
      <Query
        query={GET_LISTINGS}
        variables={{pagination: this.pagination, filters}}
        fetchPolicy="cache-and-network"
      >
        {({data, fetchMore}) => {
          const listings = data ? data.listings : null
          return (
            <Container opened={mapOpened}>
              {this.getMap()}

              <ListingsContainer opened={mapOpened}>
                {this.getListings(listings, fetchMore)}
              </ListingsContainer>
            </Container>
          )
        }}
      </Query>
    )
  }
}
