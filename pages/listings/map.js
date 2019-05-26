import get from 'lodash/get'
import {Component, Fragment} from 'react'
import Router from 'next/router'
import View from '@emcasa/ui-dom/components/View'
import {
  getListingFiltersFromState,
  getLocationFromPath
} from 'utils/filter-params.js'
import ListingFilter from 'components/listings/shared/ListingFilter'
import ParamsMapper from 'utils/params-mapper'
import {clone} from 'utils/clone'
import {Query} from 'react-apollo'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {GET_LISTINGS_COORDINATES} from 'graphql/listings/queries'
import {fetchFlag, DEVICE_ID_COOKIE} from 'components/shared/Flagr'
import {TEST_SAVE_LISTING_TEXT} from 'components/shared/Flagr/tests'
import {getCookie} from 'lib/session'
import LdJson from './components/ld-json'
import Map from 'components/listings/shared/ListingsMap'

const Locations = {
  rj: {
    restriction: {},
    center: {
      lat: -22.879793181961205,
      lng: -43.26471949989002
    }
  }
}

class ListingMapSearch extends Component {
  state = {
    height: `calc(100vh - ${HEADER_HEIGHT})`
  }

  constructor(props) {
    super(props)
    const params = props.params ? props.params : {}
    this.state = {
      filters: clone(params.filters || {}),
      neighborhood: null,
      showFavMessageBar: false
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
      headerSearch: true,
      flagrFlags
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  onResize = () => {
    this.setState({
      height: window.innerHeight - HEADER_HEIGHT
    })
  }

  /*
  componentDidMount() {
    log(LISTING_SEARCH_OPEN)

    if (!localStorage.getItem('hideFavMessageBar')) {
      this.setState({showFavMessageBar: true})
    }

    window.onpopstate = (event) => {
      if (!event || !event.state || !event.state.as) {
        return
      }
      const newFilters = ParamsMapper.getFiltersByPath(event.state.as)
      this.setState({filters: newFilters}, () => {
        if (newFilters.neighborhoods) {
          const event = new CustomEvent(NEIGHBORHOOD_SELECTION_CHANGE, {
            detail: {
              city: {
                citySlug: newFilters.citySlug,
                stateSlug: newFilters.stateSlug
              },
              neighborhoods: newFilters.neighborhoods
            }
          })
          window.dispatchEvent(event)
        }
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
    // Take action when neighborhood or city changes. We do this here because the component
    // responsible for controlling location filters is not in the same context as
    // this ListingSearch or the ListingFilter.
    const {city, neighborhoods} = detail
    const newNeighborhoods = neighborhoods ? neighborhoods.toString() : ''
    const currentNeighborhoods = this.state.filters.neighborhoods
      ? this.state.filters.neighborhoods.toString()
      : ''
    const newCitySlug = city ? city.citySlug : ''
    const currentCitySlug = this.state.citySlug
    if (newNeighborhoods !== currentNeighborhoods || newCitySlug !== currentCitySlug) {
      const newFilters = clone(this.state.filters || {})
      newFilters.neighborhoods = neighborhoods
      newFilters.citySlug = city.citySlug
      newFilters.stateSlug = city.stateSlug
      this.setState(
        {filters: newFilters},
        this.onChangeFilter.bind(this, newFilters)
      )
    }
  }

  onChangeFilter = (filters) => {
    const newPath = ParamsMapper.mapParamsToUrl(filters)
    Router.push('/listings/map', `/imoveis/mapa/${newPath}`, {
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
  */

  render() {
    const {asPath, query, params, user, client, url} = this.props
    const {filters, height} = this.state
    const listingFilters = getListingFiltersFromState(filters)
    return (
      <Query
        query={GET_LISTINGS_COORDINATES}
        variables={{filters: listingFilters}}
      >
        {({data, loading, error}) => {
          if (loading) return <div />
          if (error) return <p>ERROR</p>
          const listings = get(data || {}, 'listings.listings', [])
          return (
            <View height={height}>
              <LdJson />
              <Map
                user={user}
                data={listings}
                getInitialFrame={({markers}) => markers}
                minZoom={10}
                onChange={console.log}
                options={
                  {
                    // restriction:
                  }
                }
              />
            </View>
          )
        }}
      </Query>
    )
  }
}

export default ListingMapSearch
