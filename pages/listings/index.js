import {Component, Fragment} from 'react'
import Router from 'next/router'
import {
  treatParams,
  getListingFiltersFromState,
  getNewFiltersFromQuery,
  getLocationFromPath
} from 'utils/filter-params.js'
import ListingFilter from 'components/listings/shared/ListingFilter'
import ListingList from 'components/listings/shared/ListingList'
import {getUrlVars} from 'utils/text-utils'
import {log, LISTING_SEARCH_OPEN} from 'lib/logging'
import {Query} from 'react-apollo'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import {fetchFlag, DEVICE_ID_COOKIE} from 'components/shared/Flagr'
import FlagrProvider from 'components/shared/Flagr/Context'
import {TEST_SAVE_LISTING_TEXT} from 'components/shared/Flagr/tests'
import {getCookie} from 'lib/session'
import LdJson from './components/ld-json'
import ListingHead from './components/head'

class ListingSearch extends Component {
  constructor(props) {
    super(props)
    this.handleRouteChange = this.handleRouteChange.bind(this)
    const params = props.params ? props.params : {}
    const query = props.query ? props.query : {}
    console.log(params)
    const filters = Object.assign(
      {},
      getNewFiltersFromQuery(query, params),
      params.filters
    )
    this.state = {
      mapOpened: false,
      filters,
      neighborhood: null
    }
  }

  static async getInitialProps(context) {
    let params = {}
    if (context.req && context.req.params) {
      params = context.req.params
    } else {
      const {asPath} = context
      params = getLocationFromPath(asPath)
    }

    let query = {}
    if (context.req && context.req.query) {
      query = context.req.query
    } else if (context.query) {
      query = context.query
    }

    // Flagr
    const deviceId = getCookie(DEVICE_ID_COOKIE, context.req)
    const flagrFlags = {
      [TEST_SAVE_LISTING_TEXT]: await fetchFlag(
        TEST_SAVE_LISTING_TEXT,
        deviceId
      )
    }

    return {
      hideSeparator: true,
      transparentHeader: false,
      query,
      params,
      renderFooter: false,
      headerSearch: true,
      flagrFlags
    }
  }

  componentDidMount() {
    log(LISTING_SEARCH_OPEN)
    window.onpopstate = (event) => {
      const newQuery = getUrlVars(event.state.url)
      this.setState({
        filters: getNewFiltersFromQuery(newQuery)
      })
    }
    Router.events.on('routeChangeComplete', this.handleRouteChange)
  }

  componentWillUnmount() {
    window.onpopstate = null
    Router.events.off('routeChangeComplete', this.handleRouteChange)
  }

  handleRouteChange() {
    // Take action only when neighborhood changes. We do this here because the component
    // responsible for controlling neighborhood filters is not in the same context as
    // this ListingSearch or the ListingFilter.
    let newFilters = getNewFiltersFromQuery(Router.query)
    const newNeighborhoods = newFilters.neighborhoods
      ? newFilters.neighborhoods.toString()
      : ''
    const currentNeighborhoods = this.state.filters.neighborhoods
      ? this.state.filters.neighborhoods.toString()
      : ''
    if (newNeighborhoods !== currentNeighborhoods) {
      delete newFilters.citiesSlug
      this.setState({
        filters: newFilters
      })
      window.scrollTo(0, 0)
    }
  }

  onChangeFilter = (filters) => {
    // Add neighborhoods to new filters from Router.query
    const neighborhoodFilters = getNewFiltersFromQuery(Router.query)
      .neighborhoods
    filters.neighborhoods = neighborhoodFilters
    const newQuery = treatParams(filters)

    const {params} = this.props
    let route = ''
    if (params && Object.keys(params).length > 0) {
      route = `/${params.state}/${params.city}${
        params.neighborhood ? `/${params.neighborhood}` : ''
      }`
    }

    const query = newQuery.length > 0 ? `?${newQuery}` : ''
    Router.push(`/listings${query}`, `/imoveis${route}${query}`, {
      shallow: true
    })

    console.log(filters)
    this.setState({filters: filters})
    window.scrollTo(0, 0)
  }

  onResetFilter = () => {
    window.scrollTo(0, 0)
    this.setState({filters: {}})
    Router.push('/listings', '/imoveis', {shallow: true})
  }

  render() {
    const {query, params, user, client, url} = this.props
    const {filters} = this.state

    if (params && !filters.neighborhoods) {
      if (params.city) {
        filters.citiesSlug = [params.city]
      }
      if (params.neighborhood) {
        filters.neighborhoods = [params.neighborhood]
      }
      if (params.tag) {
        filters.tagsSlug = params.tags
      }
    }

    console.log(filters)
    const listingFilters = getListingFiltersFromState(filters)

    return (
      <FlagrProvider flagrFlags={this.props.flagrFlags}>
        <Query query={GET_DISTRICTS}>
          {({data, loading, error}) => {
            if (loading) return <div />
            if (error) return <p>ERROR</p>
            const districts = data ? data.districts : []
            return (
              <Fragment>
                <ListingHead
                  districts={districts}
                  filters={filters}
                  params={params}
                  url={url}
                />
                <LdJson />
                <ListingFilter
                  onSubmit={this.onChangeFilter}
                  values={filters}
                />
                <ListingList
                  query={query}
                  params={params}
                  user={user}
                  resetFilters={this.onResetFilter}
                  filters={listingFilters}
                  apolloClient={client}
                  districts={districts}
                  neighborhoodListener={(neighborhood) => {
                    if (!this.state.neighborhood) {
                      this.setState({neighborhood: neighborhood})
                    }
                  }}
                />
              </Fragment>
            )
          }}
        </Query>
      </FlagrProvider>
    )
  }
}

export default ListingSearch
