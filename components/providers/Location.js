import pick from 'lodash/fp/pick'
import {PureComponent} from 'react'
import * as Sentry from '@sentry/browser'
import slugify from 'slug'
import {getCookie, setCookie} from 'lib/session'
import {cities} from 'constants/cities'

const pickLocation = pick(['citySlug', 'city', 'region', 'country', 'll'])

const LOCATION_COOKIE = 'userLocation'

export default class LocationProvider extends PureComponent {
  static defaultProps = {
    defaultCitySlug: 'sao-paulo'
  }

  state = {}

  constructor(props) {
    super(props)
    if (process.browser) {
      const {defaultCitySlug} = props
      // Populate initial state with previous location from cookie
      const location = this.constructor.getLocation()
      const city = this.constructor.getCity(
        Object.assign({citySlug: defaultCitySlug}, location)
      )
      this.state = {location, city}
    }
  }

  static getCity(location) {
    if (location && location.citySlug) {
      const cityFound = cities.find(
        (city) => city.citySlug === location.citySlug
      )
      return cityFound ? cityFound : undefined
    }
  }

  static getLocation() {
    try {
      const cookie = getCookie(LOCATION_COOKIE)
      if (cookie) {
        return pickLocation(JSON.parse(cookie))
      }
    } catch (e) {
      Sentry.captureException(e)
      return {}
    }
  }

  static setLocation(location) {
    setCookie(LOCATION_COOKIE, pickLocation(location))
    if ('amplitude' in window) {
      let identify = new window.amplitude.Identify().set(
        'geoIpCity',
        location.citySlug
      )
      window.amplitude.identify(identify)
    }
  }

  static async fetch() {
    // Only fetch location once per session
    if (this._response) return this._response
    const response = await fetch('/location', {method: 'POST'})
    const data = await response.json()
    const location = (data && data.location) || {}
    if (location.city)
      location.citySlug = slugify(data.location.city.toLowerCase())
    this.setLocation(location)
    this._response = location
    return location
  }

  async componentDidMount() {
    try {
      // Attempt to update location on the client-side
      const {defaultCitySlug} = this.props
      const {fetch: fetchLocation, getCity} = this.constructor
      const location = await fetchLocation()
      const city = getCity(Object.assign({citySlug: defaultCitySlug}, location))
      this.setState({location, city})
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  render() {
    return this.props.children(pickLocation(this.state))
  }
}

export const withUserLocation = (Target) => (props) => (
  <LocationProvider>
    {({location, city}) => (
      <Target {...props} userLocation={location} userCity={city} />
    )}
  </LocationProvider>
)
