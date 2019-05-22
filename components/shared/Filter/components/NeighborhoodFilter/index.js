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
import {DEFAULT_CITY} from 'utils/location-utils'

class NeighborhoodPicker extends Component {
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.state = {
      selectedNeighborhoods: props.neighborhoods || [],
      selectedCity: props.currentCity || DEFAULT_CITY
    }
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

  getSelectedCity = (availableCities) => {
    const {selectedCity} = this.state

    if (!selectedCity) {
      return null
    }

    return availableCities.find(
      (city) => city.citySlug === selectedCity.citySlug
    )
  }

  render() {
    return (
      <Query query={GET_DISTRICTS} ssr={true}>
        {({data}) => {
          const availableCities = this.getCities(data)
          const selectedCity = this.getSelectedCity(availableCities)
          return (
            <CityContainer
              cities={availableCities}
              selectedNeighborhoods={this.state.selectedNeighborhoods}
              selectedCity={selectedCity}
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
  neighborhoods: PropTypes.array,
  currentCity: PropTypes.object.isRequired
}

export default enhanceWithClickOutside(NeighborhoodPicker)
