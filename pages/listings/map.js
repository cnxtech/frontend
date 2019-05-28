import React, {Component} from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import {
  getListingFiltersFromState,
  getLocationFromPath
} from 'utils/filter-params.js'
import {hoistStatics} from 'recompose'
import View from '@emcasa/ui-dom/components/View'
import MapControl from '@emcasa/ui-dom/components/Map/Control'
import {withUserLocation} from 'components/providers/Location'
import ListingFilter from 'components/listings/shared/ListingFilter'
import ListingList from 'components/listings/shared/ListingList'
import ParamsMapper from 'utils/params-mapper'
import {clone} from 'utils/clone'
import {log, LISTING_SEARCH_OPEN} from 'lib/logging'
import {Query} from 'react-apollo'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {GET_LISTINGS_COORDINATES} from 'graphql/listings/queries'
import LdJson from './components/ld-json'
import Map from 'components/listings/shared/ListingsMap'

const DEFAULT_LOCATION = 'sao-paulo'

const LOCATION_OPTIONS = {
  ['sao-paulo']: {
    filters: {
      citySlug: 'sao-paulo',
      stateSlug: 'sp'
    },
    restriction: {
      latLngBounds: {
        north: -23.35664512143721,
        south: -23.770154312876727,
        east: -46.363957057162565,
        west: -46.90915359036569
      }
    }
  },
  ['rio-de-janeiro']: {
    filters: {
      citySlug: 'rio-de-janeiro',
      stateSlug: 'rj'
    },
    restriction: {
      latLngBounds: {
        north: -22.85672650624514,
        south: -23.064418832793493,
        east: -42.96657081718752,
        west: -43.46095558281252
      }
    }
  }
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  .gm-fullscreen-control,
  .gm-bundled-control {
    transform: translateY(
      ${(props) => props.filterHeight + props.theme.space[4]}px
    );
  }
`

class ListingMapSearch extends Component {
  state = {
    citySlug: undefined,
    filters: {},
    filterHeight: 0,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`
  }

  filterRef = React.createRef()

  constructor(props) {
    super(props)
    this.state.filters = props.params.filters || {}
  }

  static getDerivedStateFromProps({params, userLocation}, state) {
    const citySlug =
      params.citySlug || userLocation.citySlug || DEFAULT_LOCATION
    if (citySlug !== state.citySlug) {
      const location = LOCATION_OPTIONS[citySlug] || {}
      return {
        citySlug,
        filters: Object.assign({}, state.filters, location.filters)
      }
    }
    return null
  }

  static async getInitialProps(context) {
    let params
    if (context.req && context.req.params) {
      params = context.req.params
    } else {
      const {asPath} = context
      params = getLocationFromPath(asPath)
    }
    return {
      params: params || {},
      renderFooter: false
    }
  }

  get location() {
    return LOCATION_OPTIONS[this.state.citySlug]
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
    Router.events.on('routeChangeStart', this.onChangeRoute)
    if (!this.props.params.citySlug) {
      // Redirect to resolved city url when location params are empty
      const newPath = ParamsMapper.mapParamsToUrl(this.state.filters)
      Router.push('/listings/map', `/imoveis/mapa${newPath}`, {
        shallow: true
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    Router.events.off('routeChangeStart', this.onChangeRoute)
  }

  onMapLoaded = () => {
    const interval = setInterval(() => {
      const filter = this.filterRef.current
      const body = filter && filter.bodyRef.current
      const bodyHeight = body ? body.offsetHeight || body.clientHeight : 0
      if (filter && bodyHeight) {
        this.filterRef.current.measureBody()
        clearInterval(interval)
      }
    }, 500)
  }

  onResize = () => {
    this.setState({
      height: window.innerHeight - HEADER_HEIGHT
    })
  }

  onResizeFilter = ({isRowExpanded, bodyHeight, rowHeight}) => {
    this.setState({filterHeight: isRowExpanded ? bodyHeight : rowHeight})
  }

  onChangeRoute = (path) => {
    const {filters} = getLocationFromPath(path) || {}
    if (filters) this.setState({filters})
  }

  onChangeFilter = (filters) => {
    const newPath = ParamsMapper.mapParamsToUrl(filters)
    Router.push('/listings/map', `/imoveis/mapa${newPath}`, {
      shallow: true
    })
    this.setState({filters: filters})
  }

  renderMap = ({data, error}) => {
    const {user} = this.props
    const {filters, filterHeight} = this.state
    const location = this.location
    if (error) return <p>ERROR</p>
    const listings = (data && data.listings && data.listings.listings) || []
    return (
      <MapContainer filterHeight={filterHeight}>
        <Map
          user={user}
          data={listings}
          getInitialFrame={({markers}) => markers}
          defaultZoom={10}
          defaultCenter={location.center}
          options={location}
          onMapLoaded={this.onMapLoaded}
        >
          <MapControl m={0} width="100vw" bg="white" position="top-center">
            <View pr={2} pl={2}>
              <ListingFilter
                innerRef={this.filterRef}
                onLayout={this.onResizeFilter}
                onSubmit={this.onChangeFilter}
                values={filters}
              />
            </View>
          </MapControl>
        </Map>
      </MapContainer>
    )
  }

  render() {
    const {filters, height} = this.state
    return (
      <View height={height}>
        <LdJson />
        <Query
          query={GET_LISTINGS_COORDINATES}
          variables={{filters: getListingFiltersFromState(filters)}}
        >
          {this.renderMap}
        </Query>
      </View>
    )
  }
}

export default hoistStatics(withUserLocation)(ListingMapSearch)
