import once from 'lodash/once'
import React, {Component} from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import {themeGet} from 'styled-system'
import {
  getListingFiltersFromState,
  getLocationFromPath
} from 'utils/filter-params.js'
import {hoistStatics} from 'recompose'
import View from '@emcasa/ui-dom/components/View'
import MapControl from '@emcasa/ui-dom/components/Map/Control'
import {withUserLocation} from 'components/providers/Location'
import ListingFilter from 'components/listings/shared/ListingFilter'
import ParamsMapper from 'utils/params-mapper'
import {Query} from 'react-apollo'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {GET_LISTINGS_COORDINATES} from 'graphql/listings/queries'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import ListingHead from './components/head'
import LdJson from './components/ld-json'
import Map from 'components/listings/shared/ListingsMap'
import {NEIGHBORHOOD_SELECTION_CHANGE} from '../../components/shared/NeighborhoodPicker/events'

const DEFAULT_LOCATION = 'sao-paulo'

const LOCATION_OPTIONS = {
  ['sao-paulo']: {
    filters: {
      citySlug: 'sao-paulo',
      stateSlug: 'sp'
    },
    options: {
      restriction: {
        latLngBounds: {
          north: -23.35664512143721,
          south: -23.770154312876727,
          east: -46.363957057162565,
          west: -46.90915359036569
        }
      }
    }
  },
  ['rio-de-janeiro']: {
    filters: {
      citySlug: 'rio-de-janeiro',
      stateSlug: 'rj'
    },
    options: {
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
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  .gm-fullscreen-control,
  .gm-bundled-control {
    margin-right: ${themeGet('space.4')}px;
    transform: translateY(
      ${(props) => props.filterHeight + props.theme.space[4]}px
    );
  }
`

class ListingMapSearch extends Component {
  state = this.initialState

  mapRef = React.createRef()

  filterRef = React.createRef()

  get initialState() {
    const {params, userLocation} = this.props
    const citySlug =
      params.citySlug || userLocation.citySlug || DEFAULT_LOCATION
    const location = LOCATION_OPTIONS[citySlug] || {}
    const filters = Object.assign({}, params.filters, location.filters)
    return {
      filters,
      filterHeight: 0,
      height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }
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
      renderFooter: false,
      headerSearch: true
    }
  }

  get citySlug() {
    const {citySlug} = this.state.filters
    return Object.keys(LOCATION_OPTIONS).find((city) => city === citySlug) || DEFAULT_LOCATION
  }

  get location() {
    return LOCATION_OPTIONS[this.citySlug]
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener(
      NEIGHBORHOOD_SELECTION_CHANGE,
      this.onChangeNeighborhoods
    )
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
    window.removeEventListener(
      NEIGHBORHOOD_SELECTION_CHANGE,
      this.onChangeNeighborhoods
    )
    Router.events.off('routeChangeStart', this.onChangeRoute)
  }

  onMapLoaded = ({map}) => {
    this.setState({map})
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

  onResizeFilter = ({height}) => {
    this.setState({filterHeight: height})
  }

  onChangeRoute = (path) => {
    const {filters} = getLocationFromPath(path) || {}
    if (filters) this.setState({filters})
  }

  onChangeNeighborhoods = ({detail: {city, neighborhoods}}) => {
    this.onChangeFilter({
      ...this.state.filters,
      citySlug: city.citySlug,
      stateSlug: city.stateSlug,
      neighborhoods
    })
  }

  onChangeFilter = (filters) => {
    const newPath = ParamsMapper.mapParamsToUrl(filters)
    Router.push('/listings/map', `/imoveis/mapa${newPath}`, {
      shallow: true
    })
    this.setState({filters})
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
          key={this.citySlug}
          ref={this.mapRef}
          user={user}
          data={listings}
          getInitialFrame={({markers}) => markers}
          defaultZoom={10}
          defaultCenter={location.center}
          options={location.options}
          onMapLoaded={this.onMapLoaded}
        >
          <MapControl m={0} width="100vw" bg="white" position="top-center">
            <View pr={4} pl={4}>
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
    const {url, params} = this.props
    const {filters, height} = this.state
    return (
      <View height={height}>
        <Query query={GET_DISTRICTS}>
          {({data}) => (
            <ListingHead
              districts={data ? data.districts : []}
              filters={filters}
              params={params}
              url={url}
            />
          )}
        </Query>
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
