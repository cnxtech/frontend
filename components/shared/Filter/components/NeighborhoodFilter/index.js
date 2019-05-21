import React, {Component} from 'react'
import PropTypes from 'prop-types'
import enhanceWithClickOutside from 'react-click-outside'
import slugify from 'slug'
import * as Sentry from '@sentry/browser/dist/index'
import CityContainer from './components/CityContainer'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import {Query} from 'react-apollo/index'
import {cities} from 'constants/cities'
import {
  log,
  LISTING_SEARCH_NEIGHBORHOOD_OPEN,
  LISTING_SEARCH_NEIGHBORHOOD_APPLY,
  LISTING_SEARCH_NEIGHBORHOOD_CLEAR,
  LISTING_SEARCH_NEIGHBORHOOD_EXPAND,
  LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY
} from 'lib/logging'

export const DEFAULT_CITY_SLUG = 'sao-paulo'
export const DEFAULT_CITY = cities.find(
  (city) => city.citySlug === DEFAULT_CITY_SLUG
)

class NeighborhoodPicker extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.containerRef = React.createRef()
    this.state = {
      selectedNeighborhoods: props.neighborhoods || [],
      selectedCity: null
    }
  }

  componentDidMount() {
    if (!process.browser) {
      return
    }

    fetch('/location', {method: 'POST'})
      .then((response) => response.json())
      .then((result) => {
        const userCity = this.getUserCityByGeoIp(result)
        if (userCity) {
          let identify = new amplitude.Identify().set(
            'geoIpCity',
            userCity.name
          )
          amplitude.identify(identify)
          this.applyUserCityFromGeoIp(userCity)
        } else {
          this.applyUserCityFromGeoIp(DEFAULT_CITY)
        }
      })
  }

  getUserCityByGeoIp = (result) => {
    if (result && result.location && result.location.city) {
      const {city} = result.location
      const citySlug = slugify(city.toLowerCase())
      const cityFound = cities.find((city) => city.citySlug === citySlug)
      const userCity = cityFound ? cityFound : DEFAULT_CITY
      return userCity
    }
    return null
  }

  applyUserCityFromGeoIp = (userCity) => {
    const {pathname} = location
    let city = userCity
    if (pathname !== '/imoveis') {
      const location = pathname.split('/imoveis/')[1]
      if (location) {
        const citySlug = location.split('/')[1]
        const urlCity = cities.find((city) => city.citySlug === citySlug)
        if (urlCity) {
          city = urlCity
        }
      }
      if (pathname === '/') {
        const cityAutoSelection = cities.find((city) => city.citySlug === userCity.citySlug)
        if (cityAutoSelection) {
          city = cityAutoSelection
        }
      }
    }
    this.selectCity(city, this.props.neighborhoods)
  }

  selectCity = (city, neighborhoods = []) => {
    this.setState({selectedCity: city, selectedNeighborhoods: neighborhoods})
    this.props.onChange({
      city,
      neighborhoods
    })
    log(LISTING_SEARCH_NEIGHBORHOOD_EXPAND, {city: city.citySlug})
  }

  showAllCities = () => {
    log(LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY, {
      city: this.state.selectedCity.citySlug
    })
    this.setState({selectedCity: null})
    this.props.onChange({})
  }

  selectNeighborhoods = (newSelection) => {
    this.changeSelection(newSelection, () => {
      log(LISTING_SEARCH_NEIGHBORHOOD_APPLY, {
        neighborhoods: this.state.selectedNeighborhoods
      })
    })
    this.props.onChange({
      city: this.state.selectedCity,
      neighborhoods: newSelection
    })
  }

  changeSelection = (newSelection, onFinished) => {
    this.setState({selectedNeighborhoods: newSelection}, onFinished)
  }

  getCities = (data) => {
    try {
      if (data && data.districts) {
        let citiesNeighborhoods = cities
        citiesNeighborhoods.forEach((city) => (city.neighborhoods = []))
        data.districts.forEach((item) => {
          citiesNeighborhoods
            .find((city) => city.citySlug === item.citySlug)
            .neighborhoods.push(item)
        })
        citiesNeighborhoods.forEach((city) =>
          city.neighborhoods.sort((n1, n2) =>
            n1.nameSlug.localeCompare(n2.nameSlug)
          )
        )
        return citiesNeighborhoods
      }
    } catch (e) {
      Sentry.captureException(e)
      return []
    }
  }

  render() {
    return (
      <Query query={GET_DISTRICTS} ssr={true}>
        {({data}) => {
          const availableCities = this.getCities(data)
          return (
            <CityContainer
              cities={availableCities}
              selectedNeighborhoods={this.state.selectedNeighborhoods}
              selectedCity={this.state.selectedCity}
              isCitySelected={this.isCitySelected}
              selectCity={this.selectCity}
              selectNeighborhoods={this.selectNeighborhoods}
              parentRef={this.containerRef.current}
              showAllCities={this.showAllCities}
            />
          )
        }}
      </Query>
    )
  }
}

NeighborhoodPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  neighborhoods: PropTypes.array
}

export default enhanceWithClickOutside(NeighborhoodPicker)
