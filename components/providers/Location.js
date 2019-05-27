import pick from 'lodash/fp/pick'
import {PureComponent} from 'react'
import * as Sentry from '@sentry/browser'
import slugify from 'slug'
import {getCookie, setCookie} from 'lib/session'

const pickLocation = pick(['citySlug', 'city', 'region', 'country', 'll'])

const LOCATION_COOKIE = 'userLocation'

export default class LocationProvider extends PureComponent {
  state = {}

  constructor(props) {
    super(props)
    if (process.browser) {
      // Populate initial state with previous location from cookie
      this.state = this.constructor.getLocation()
    }
  }

  static async getLocation() {
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

  static async setLocation(location) {
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
      const location = await this.constructor.fetch()
      this.setState(location)
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
    {(location) => <Target userLocation={location} {...props} />}
  </LocationProvider>
)
