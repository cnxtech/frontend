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
import LocationProvider, {withUserLocation} from 'components/providers/Location'
import ActionsBar from 'components/shared/ActionsBar'
import ParamsMapper from 'utils/params-mapper'
import {Query} from 'react-apollo'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {GET_LISTINGS_COORDINATES} from 'graphql/listings/queries'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import ListingHead from './components/head'
import LdJson from './components/ld-json'
import Map from 'components/listings/shared/ListingsMap'
import {
  log,
  LISTING_SEARCH_MAP_OPEN,
  LISTING_SEARCH_MAP_ZOOM,
  LISTING_SEARCH_MAP_PAN,
  LISTING_SEARCH_MAP_PIN,
  LISTING_SEARCH_MAP_CLUSTER
} from 'lib/logging'

const DEFAULT_LOCATION = 'sao-paulo'
const DEFAULT_ZOOM = 10

const getPositionFromHash = (hash) => {
  if (hash[0] !== '@') return {}
  const [lat, lng, zoom] = hash.slice(1).split(',')
  if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) return {}
  return {
    center: {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    },
    zoom: parseInt(zoom)
  }
}

const getHashFromPosition = ({center: {lat, lng}, zoom}) =>
  `@${lat},${lng},${zoom}`

const LOCATION_OPTIONS = {
  ['sao-paulo']: {
    filters: {
      citySlug: 'sao-paulo',
      stateSlug: 'sp'
    },
    // Consolação
    center: {lat: -23.554009999478296, lng: -46.65491316171875}
  },
  ['rio-de-janeiro']: {
    filters: {
      citySlug: 'rio-de-janeiro',
      stateSlug: 'rj'
    },
    // Lagoa
    center: {lat: -22.972123, lng: -43.2332571}
  }
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  .gm-fullscreen-control,
  .gm-bundled-control {
    margin-right: ${themeGet('space.4')}px !important;
    transform: translateY(
      ${({theme}) => theme.buttonHeight[1] + theme.space[5]}px
    );
  }
`

class ListingMapSearch extends Component {
  state = this.initialState

  mapRef = React.createRef()

  filterRef = React.createRef()

  get initialState() {
    const {params = {}, userLocation = {}} = this.props
    const citySlug =
      params.citySlug || userLocation.citySlug || DEFAULT_LOCATION
    const location = LOCATION_OPTIONS[citySlug] || {}
    const filters = Object.assign({}, params.filters, location.filters)
    return Object.assign(
      {
        filters,
        filterHeight: 0,
        zoom: DEFAULT_ZOOM,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`
      },
      process.browser
        ? getPositionFromHash((window.location.hash || '').slice(1))
        : undefined
    )
  }

  static async getInitialProps(context) {
    let params
    if (context.req && context.req.params) {
      params = context.req.params
    } else {
      const {asPath} = context
      params = getLocationFromPath(asPath.split('#')[0])
    }
    return {
      params: params || {},
      renderFooter: false
    }
  }

  get citySlug() {
    const {citySlug} = this.state.filters
    return (
      Object.keys(LOCATION_OPTIONS).find((city) => city === citySlug) ||
      DEFAULT_LOCATION
    )
  }

  get location() {
    return LOCATION_OPTIONS[this.citySlug]
  }

  get positionHash() {
    return getHashFromPosition(this.state)
  }

  componentDidMount() {
    log(LISTING_SEARCH_MAP_OPEN)
    window.addEventListener('resize', this.onResize)
    this.onResize()
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
  }

  resetMap = () => {
    this.state.map.setOptions(this.location.options)
    this.state.map.setCenter(this.location.center)
    this.state.map.setZoom(DEFAULT_ZOOM)
  }

  getInitialFrame = ({markers}) => {
    const {center} = this.state
    if (center) return [center]
    else return markers
  }

  onMapLoaded = ({map}) => {
    this.setState({map})
  }

  onChangeBounds = ({center, zoom}) => {
    if (!this.state.map) return
    requestAnimationFrame(() => {
      this.setState({center, zoom}, () => {
        Router.replace(
          '/listings/map',
          `${window.location.pathname}#${this.positionHash}`
        )
      })
    })
  }

  onResize = () => {
    this.setState({
      height: window.innerHeight - HEADER_HEIGHT
    })
  }

  onChangeFilter = (_filters) => {
    const prevCitySlug = this.state.filters.citySlug
    const filters = Object.assign({}, this.location.filters, _filters)
    const changedCity = filters.citySlug !== prevCitySlug
    const newPath = ParamsMapper.mapParamsToUrl(filters)
    const hash = changedCity ? '' : `#${this.positionHash}`
    Router.push('/listings/map', `/imoveis/mapa${newPath}${hash}`, {
      shallow: true
    })
    this.setState({filters}, changedCity ? this.resetMap : undefined)
  }

  renderMap = ({data, error}) => {
    const {user, userCity} = this.props
    const {filters, center, zoom} = this.state
    const {citySlug} = filters
    const location = this.location
    if (error) return <p>ERROR</p>
    const listings = (data && data.listings && data.listings.listings) || []
    return (
      <MapContainer>
        <Map
          ref={this.mapRef}
          user={user}
          data={listings}
          minZoom={DEFAULT_ZOOM}
          defaultZoom={zoom}
          defaultCenter={center || location.center}
          options={Object.assign({rotateControl: true}, location.options)}
          getInitialFrame={this.getInitialFrame}
          onMapLoaded={this.onMapLoaded}
          onChange={this.onChangeBounds}
          onZoomChange={() => log(LISTING_SEARCH_MAP_ZOOM)}
          onDragEnd={() => log(LISTING_SEARCH_MAP_PAN)}
          onClickCluster={() => log(LISTING_SEARCH_MAP_CLUSTER)}
          onSelect={({id}) => log(LISTING_SEARCH_MAP_PIN, {listingId: id})}
        >
          <MapControl
            m={0}
            zIndex={10}
            width="100vw"
            bg="white"
            position="top-center"
          >
            <ActionsBar
              user={user}
              currentCity={LocationProvider.getCity({citySlug}) || userCity}
              innerRef={this.filterRef}
              onLayout={this.onResizeFilter}
              onSubmit={this.onChangeFilter}
              filters={filters}
            />
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
