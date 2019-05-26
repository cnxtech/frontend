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
      try {
        const cookie = getCookie(LOCATION_COOKIE)
        if (cookie) {
          this.state = pickLocation(JSON.parse(cookie))
          this.state.loaded = true
        }
      } catch (e) {
        // ...
      }
    }
  }

  fetch = async () => {
    const response = await fetch('/location', {method: 'POST'})
    const data = await response.json()
    this.setState({loaded: true})
    if (data && data.location) {
      data.location.citySlug = slugify(data.location.city.toLowerCase())
      this.setState(data.location)
      return data.location
    }
    return {}
  }

  update = async () => {
    const location = await this.fetch()
    setCookie(LOCATION_COOKIE, JSON.stringify(location))
    return location
  }

  async componentDidMount() {
    try {
      let {loaded, citySlug} = this.state
      if (!loaded) citySlug = (await this.update()).citySlug
      if ('amplitude' in window) {
        let identify = new window.amplitude.Identify().set(
          'geoIpCity',
          citySlug
        )
        window.amplitude.identify(identify)
      }
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
