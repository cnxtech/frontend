import {Component, Fragment} from 'react'
import Router from 'next/router'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import {
  getListingFiltersFromState,
  getLocationFromPath
} from 'utils/filter-params.js'
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
import ActionsBar from 'components/shared/ActionsBar'
import {cities} from 'constants/cities'
import LocationUtils from '../../utils/location-utils'

class ListingSearch extends Component {
  constructor(props) {
    super(props)
    const params = props.params ? props.params : {}
    this.state = {
      mapOpened: false,
      filters: clone(params.filters || {}),
      neighborhood: null,
      currentCity: params.currentCity
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

    if (params && params.filters) {
      const {citySlug} = params.filters
      const currentCity = cities.find((city) => city.citySlug === citySlug)
      params.currentCity = currentCity
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
      asPath: context.asPath,
      hideSeparator: true,
      transparentHeader: false,
      params,
      renderFooter: false,
      headerSearch: false,
      flagrFlags
    }
  }

  componentDidMount() {
    log(LISTING_SEARCH_OPEN)

    if (!this.state.currentCity) {
      LocationUtils.getUserLocationByIp().then(this.updateCurrentCity)
    }
    window.onpopstate = (event) => {
      if (!event || !event.state || !event.state.as) {
        return
      }
      const newFilters = ParamsMapper.getFiltersByPath(event.state.as)
      this.setState(
        {filters: newFilters},
        this.onChangeFilter.bind(this, newFilters)
      )
    }
  }

  componentWillUnmount() {
    window.onpopstate = null
  }

  updateCurrentCity = (currentCity) => {
    const newFilters = clone(this.state.filters)
    newFilters.citySlug = currentCity.citySlug
    newFilters.stateSlug = currentCity.stateSlug
    this.setState(
      {currentCity, filters: newFilters},
      this.onChangeFilter.bind(this, newFilters)
    )
  }

  onChangeFilter = (filters) => {
    const newPath = ParamsMapper.mapParamsToUrl(filters)
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
    const {asPath, query, params, user, client, url} = this.props
    const {filters, currentCity} = this.state
    const listingFilters = getListingFiltersFromState(filters)
    const isRoot = asPath === '/'
    return (
      <FlagrProvider flagrFlags={this.props.flagrFlags}>
        <Query query={GET_DISTRICTS}>
          {({data, loading, error}) => {
            if (loading) return <div />
            if (error) return <p>ERROR</p>
            const districts = data ? data.districts : []
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
                  return (
                    <Fragment>
                      <ListingHead
                        districts={districts}
                        filters={filters}
                        params={params || {}}
                        url={url}
                      />
                      <LdJson />
                      {currentCity && (
                        <ActionsBar
                          user={user}
                          filters={filters}
                          currentCity={currentCity}
                          onSubmit={this.onChangeFilter}
                          favorites={favorites}
                        />
                      )}
                      <ListingList
                        isRoot={isRoot}
                        query={query}
                        params={params || {}}
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
                  )}}
              </Query>
            )
          }}
        </Query>
      </FlagrProvider>
    )
  }
}

export default ListingSearch
