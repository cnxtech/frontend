import {Component, Fragment} from 'react'
import {Query} from 'react-apollo'
import {FadeLoader} from 'react-spinners'
import theme from '@emcasa/ui'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import {
  GET_LISTINGS,
  GET_LISTING,
  GET_LISTINGS_COORDINATES
} from 'graphql/listings/queries'
import differenceBy from 'lodash/differenceBy'
import map from 'lodash/map'
import ListingInfiniteScroll from 'components/shared/ListingInfiniteScroll'
import ListingCard from 'components/listings/shared/ListingCard'
import Map from 'components/listings/shared/Map'
import ListingsNotFound from 'components/listings/shared/NotFound'
import Neighborhood from 'components/listings/shared/Neighborhood'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {getTitleTextByFilters, getTitleTextByParams} from './title'
import {log, LISTING_SEARCH_MAP_PIN, LISTING_SEARCH_RESULTS} from 'lib/logging'
import {Container, MapContainer, Title} from './styles'
import {buildSlug} from 'lib/listings'
import {thumbnailUrl} from 'utils/image_url'

class ListingList extends Component {
  constructor(props) {
    super(props)
    this.pagination = {
      pageSize: 12,
      excludedListingIds: []
    }
  }
  state = {}

  componentWillReceiveProps(newProps) {
    const currentFilters = this.props.filters
    const newFilters = newProps.filters
    if (currentFilters !== newFilters) {
      this.pagination.excludedListingIds = []
    }
  }

  getLoading = () => (
    <Row justifyContent="center" mt="80px">
      <FadeLoader
        width={10}
        height={10}
        margin="2"
        radius={8}
        color={theme.colors.pink}
      />
    </Row>
  )

  getListings = (result, fetchMore, loading) => {
    const {
      user,
      params,
      filters,
      onHoverListing,
      onLeaveListing,
      highlight,
      neighborhoodListener
    } = this.props

    if (loading) {
      return this.getLoading()
    }

    if (result && result.listings.length > 0) {
      return (
        <Query
          query={GET_USER_LISTINGS_ACTIONS}
          ssr={true}
          skip={!user.authenticated}
        >
          {({data, loading}) => {
            if (loading) {
              return <div />
            }
            const userProfile = data ? data.userProfile : null
            const favorites = userProfile ? userProfile.favorites : []
            const filteredListings = differenceBy(result.listings, 'id')
            return (
              <Fragment>
                <ListingInfiniteScroll
                  titleComponent={
                    params.neighborhood && (
                      <Neighborhood
                        neighborhood={params.neighborhood}
                        state={params.stateSlug}
                        city={params.citySlug}
                        neighborhoodListener={neighborhoodListener}
                      />
                    )
                  }
                  entries={filteredListings}
                  filters={filters}
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
                >
                  {(listing) => (
                    <ListingCard
                      onMouseEnter={onHoverListing}
                      onMouseLeave={onLeaveListing}
                      highlight={highlight}
                      key={listing.id}
                      listing={listing}
                      currentUser={user}
                      loading={loading}
                      favorited={favorites || []}
                    />
                  )}
                </ListingInfiniteScroll>
              </Fragment>
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

    log(LISTING_SEARCH_MAP_PIN, {listingId: id, filters: filters})

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

  getMap = () => {
    const {highlight} = this.state
    const {filters} = this.props

    return (
      <Query query={GET_LISTINGS_COORDINATES} variables={{filters}}>
        {({data: {listings: mapListings}}) => {
          if (!mapListings) {
            return <MapContainer />
          }
          return (
            <MapContainer>
              <Map
                zoom={13}
                onSelect={this.onSelectListing}
                listings={mapListings.listings}
                highlight={highlight}
                onChange={this.onChangeMap}
                updateAfterApiCall
              />
            </MapContainer>
          )
        }}
      </Query>
    )
  }

  getItemList = (listings) => {
    if (process.browser) {
      log(LISTING_SEARCH_RESULTS, {listings})
    }

    const itemListElement = []

    listings.map((listing, index) => {
      const name = `${listing.type} à venda na ${listing.address.street} - ${
        listing.address.neighborhood
      }, ${listing.address.city} - ID${listing.id}`
      const photos = []

      listing.images.map((img, imgIndex) => {
        photos.push({
          '@type': 'ImageObject',
          url: thumbnailUrl(img.filename),
          name: `Foto ${imgIndex + 1} - ${name}`
        })
      })

      itemListElement.push({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': listing.type === 'Casa' ? 'House' : 'Apartment',
          '@id': 'https://www.emcasa.com' + buildSlug(listing),
          url: 'https://www.emcasa.com' + buildSlug(listing),
          name: name,
          description: listing.description,
          address: {
            '@context': 'http://schema.org',
            '@type': 'PostalAddress',
            streetAddress: listing.address.street,
            addressLocality: listing.address.city,
            addressRegion: listing.address.state,
            addressCountry: 'BR'
          },
          photo: photos,
          image: photos,
          numberOfRooms: listing.rooms
        }
      })
    })

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: itemListElement
          })
        }}
      />
    )
  }

  waitForLocation = () => {
    const {isRoot, filters} = this.props
    return isRoot && !filters.neighborhoodSlugs && process.browser && location.pathname.endsWith('/imoveis')
  }

  render() {
    const {isRoot, filters, params, districts} = this.props
    const h1Content =
      filters && filters.neighborhoodsSlugs
        ? getTitleTextByFilters(filters.neighborhoodsSlugs, districts)
        : getTitleTextByParams(params, districts)

    // If user is accessing '/imoveis', wait for location before querying
    if (this.waitForLocation()) {
      return this.getLoading()
    }

    return (
      <Query
        query={GET_LISTINGS}
        variables={{pagination: this.pagination, filters}}
        fetchPolicy="cache-and-network"
        ssr={!isRoot}
      >
        {({loading, error, data, fetchMore}) => {
          const listings = data ? data.listings : null
          const hasListings =
            listings && listings.listings && listings.listings.length > 0
          return (
            <Container>
              {hasListings && this.getItemList(listings.listings)}
              <Col width="100%">
                <Title as="h2" fontWeight="normal">
                  {h1Content}
                </Title>
                {this.getListings(listings, fetchMore, loading)}
              </Col>
              {hasListings && this.getMap()}
            </Container>
          )
        }}
      </Query>
    )
  }
}

export default ListingList
