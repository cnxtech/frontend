import get from 'lodash/get'
import {Component} from 'react'
import Router from 'next/router'
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

class ListingMapSearch extends Component {
  state = {
    location: undefined,
    height: `calc(100vh - ${HEADER_HEIGHT})`
  }

  static async getInitialProps() {
    return {
      renderFooter: false
    }
  }

  get filters() {
    return {
      citiesSlug: [this.props.userLocation.citySlug || DEFAULT_LOCATION]
    }
  }

  get location() {
    return LOCATION_OPTIONS[
      this.props.userLocation.citySlug || DEFAULT_LOCATION
    ]
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

  renderMap = ({data, loading, error}) => {
    const {user} = this.props
    const location = this.location
    if (!location || loading) return <div />
    if (error) return <p>ERROR</p>
    const listings = get(data || {}, 'listings.listings', [])
    return (
      <Map
        user={user}
        data={listings}
        getInitialFrame={({markers}) => markers}
        defaultZoom={10}
        defaultCenter={location.center}
        getInitialFrame={({markers}) => markers}
        options={location}
      >
        <MapControl m={0} position="top">
          <View width="100vw">eyyy lmao</View>
        </MapControl>
        <MapControl position="top-right">
          <View width="40px" height="40px" />
        </MapControl>
      </Map>
    )
  }

  render() {
    const {height} = this.state
    return (
      <View height={height}>
        <LdJson />
        <Query
          query={GET_LISTINGS_COORDINATES}
          variables={{filters: this.filters}}
        >
          {this.renderMap}
        </Query>
      </View>
    )
  }
}

export default hoistStatics(withUserLocation)(ListingMapSearch)
