import {Component, Fragment} from 'react'
import Router from 'next/router'
import {
  getListingFiltersFromState,
  getLocationFromPath
} from 'utils/filter-params.js'
import ListingFilter from 'components/listings/shared/ListingFilter'
import ListingList from 'components/listings/shared/ListingList'
import ParamsMapper from 'utils/params-mapper'
import {clone} from 'utils/clone'
import {log, LISTING_SEARCH_OPEN} from 'lib/logging'
import {Query} from 'react-apollo'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import {fetchFlag, DEVICE_ID_COOKIE} from 'components/shared/Flagr'
import FlagrProvider from 'components/shared/Flagr/Context'
import {TEST_SAVE_LISTING_TEXT} from 'components/shared/Flagr/tests'
import {getCookie} from 'lib/session'
import LdJson from './components/ld-json'
import ListingHead from './components/head'
import {NEIGHBORHOOD_SELECTION_CHANGE} from '../../components/shared/NeighborhoodPicker/events'

class ListingSearch extends Component {
  constructor(props) {
    super(props)
    const params = props.params ? props.params : {}
    this.state = {
      mapOpened: false,
      filters: clone(params.filters),
      neighborhood: null
    }
    console.log(params)
  }

  static async getInitialProps(context) {
    let params = {}
    if (context.req && context.req.params) {
      params = context.req.params
    } else {
      const {asPath} = context
      params = getLocationFromPath(asPath)
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
      params,
      renderFooter: false,
      headerSearch: true,
      flagrFlags
    }
  }

  componentDidMount() {
    log(LISTING_SEARCH_OPEN)
    window.onpopstate = (event) => {
      const params = getLocationFromPath(event.state.url)
      this.setState({
        filters: params.filters
      })
    }
    window.addEventListener(
      NEIGHBORHOOD_SELECTION_CHANGE,
      this.handleNeighborhoodChange
    )
  }

  componentWillUnmount() {
    window.onpopstate = null
    window.removeEventListener(
      NEIGHBORHOOD_SELECTION_CHANGE,
      this.handleNeighborhoodChange
    )
  }

  handleNeighborhoodChange = ({detail}) => {
    // Take action only when neighborhood changes. We do this here because the component
    // responsible for controlling neighborhood filters is not in the same context as
    // this ListingSearch or the ListingFilter.
    const {neighborhoods} = detail
    const newNeighborhoods = neighborhoods ? neighborhoods.toString() : ''
    const currentNeighborhoods = this.state.filters.neighborhoods
      ? this.state.filters.neighborhoods.toString()
      : ''
    if (newNeighborhoods !== currentNeighborhoods) {
      const newFilters = clone(this.state.filters)
      newFilters.neighborhoods = neighborhoods
      this.setState(
        {filters: newFilters},
        this.onChangeFilter.bind(this, newFilters)
      )
    }
  }

  onChangeFilter = (filters) => {
    const newPath = ParamsMapper.mapParamsToUrl(this.props.params, filters)
    Router.push('/listings', `/imoveis${newPath}`, {
      shallow: true
    })

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
