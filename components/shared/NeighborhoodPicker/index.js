import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {PoseGroup} from 'react-pose'
import Router from 'next/router'
import enhanceWithClickOutside from 'react-click-outside'
import slugify from 'slug'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import AngleDown from '@fortawesome/fontawesome-pro-light/faAngleDown'
import AngleUp from '@fortawesome/fontawesome-pro-light/faAngleUp'
import * as Sentry from '@sentry/browser'
import Background from 'components/shared/Background'
import FadeInOut from 'components/shared/Animation/FadeInOut'
import Icon from '@emcasa/ui-dom/components/Icon'
import Col from '@emcasa/ui-dom/components/Col'
import CityContainer from './components/CityContainer'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import {Query} from 'react-apollo'
import {cities} from 'constants/cities'
import {arrayToString} from 'utils/text-utils'
import {isCitySelected} from 'components/shared/NeighborhoodPicker/components/CityContainer/selection'
import {
  log,
  LISTING_SEARCH_NEIGHBORHOOD_OPEN,
  LISTING_SEARCH_NEIGHBORHOOD_APPLY,
  LISTING_SEARCH_NEIGHBORHOOD_CLEAR,
  LISTING_SEARCH_NEIGHBORHOOD_EXPAND,
  LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY
} from 'lib/logging'
import {
  InputWrapper,
  InputContainer,
  SearchContainer,
  SearchTextContainer,
  BackIcon,
  BackButton,
  ButtonText
} from './styles'
import {NEIGHBORHOOD_SELECTION_CHANGE} from './events'

const DEFAULT_BUTTON_TEXT = 'Escolha uma cidade'
export const DEFAULT_CITY_SLUG = 'sao-paulo'
export const DEFAULT_CITY = cities.find((city) => city.citySlug === DEFAULT_CITY_SLUG)

class NeighborhoodPicker extends Component {
  constructor(props) {
    super(props)
    this.getCities = this.getCities.bind(this)
    this.toggleCitiesDisplay = this.toggleCitiesDisplay.bind(this)
    this.changeSelection = this.changeSelection.bind(this)
    this.clear = this.clear.bind(this)
    this.apply = this.apply.bind(this)
    this.getButtonText = this.getButtonText.bind(this)
    this.showAllCities = this.showAllCities.bind(this)

    this.containerRef = React.createRef()
    this.state = {
      selectedNeighborhoods: props.neighborhood || [],
      selectedCity: null,
      showCities: this.props.mobile
    }
  }

  componentDidMount() {
    if (!process.browser) {
      return
    }
    fetch('/location', {method: 'POST'}).then((response) => response.json()).then((result) => {
      let userCity = this.getUserCityByGeoIp(result)
      if (userCity) {
        let identify = new amplitude.Identify().set('geoIpCity', userCity.name)
        amplitude.identify(identify)
      } else {
        userCity = DEFAULT_CITY
      }

      this.applyUserCityFromGeoIp(userCity)
    }).catch((e) => {
      Sentry.captureException(e)
      this.applyUserCityFromGeoIp(DEFAULT_CITY)
    })
  }

  getUserCityByGeoIp = (result) => {
    if (result && result.location && result.location.city) {
      const {city} = result.location
      const citySlug = slugify(city.toLowerCase())
      const cityFound = cities.find((city) => city.citySlug === citySlug)
      const userCity = cityFound ? cityFound : null
      return userCity
    }
    return null
  }

  applyUserCityFromGeoIp = (userCity) => {
    const {pathname} = location
    if (pathname !== '/imoveis') {
      const location = pathname.split('/imoveis/')[1]
      if (location) {
        const citySlug = location.split('/')[1]
        const urlCity = cities.find((city) => city.citySlug === citySlug)
        if (urlCity) {
          this.selectCity(urlCity)
        }
      }
      if (pathname === '/') {
        const cityAutoSelection = cities.find((city) => city.citySlug === userCity.citySlug)
        if (cityAutoSelection) {
          this.selectCity(cityAutoSelection)
        }
      }
      return
    }
    if (!this.state.selectedCity) {
      this.selectCity(userCity)
    }
    const filterNeighborhoods = userCity.neighborhoods.map((neighborhood) => neighborhood.nameSlug)
    this.apply(filterNeighborhoods)
  }

  selectCity = (city) => {
    log(LISTING_SEARCH_NEIGHBORHOOD_EXPAND, {city: city.citySlug})
    this.setState({selectedCity: city})
  }

  showAllCities() {
    log(LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY, {
      city: this.state.selectedCity.citySlug
    })
    this.setState({selectedCity: null})
  }

  clear() {
    log(LISTING_SEARCH_NEIGHBORHOOD_CLEAR)
    this.setState({selectedNeighborhoods: []}, () => {
      this.apply([])
    })
  }

  apply(newSelection) {
    this.changeSelection(newSelection, () => {
      const {selectedCity, selectedNeighborhoods} = this.state
      log(LISTING_SEARCH_NEIGHBORHOOD_APPLY, {
        neighborhoods: selectedNeighborhoods,
        fromHome: this.props.fromHome
      })
      if (this.state.showCities) {
        this.toggleCitiesDisplay()
      }
      if (this.props.onBackPressed) {
        this.props.onBackPressed()
      }
      if (!selectedCity) {
        return
      }

      const allNeighborhoodsSelected = isCitySelected(cities, selectedNeighborhoods, selectedCity.citySlug)

      if (this.props.fromHome) {
        const {selectedCity} = this.state
        const neighborhoodsUrl = selectedNeighborhoods.join('/')
        Router.push('/listings', `/imoveis/${selectedCity.stateSlug}/${selectedCity.citySlug}${!allNeighborhoodsSelected ? `/${neighborhoodsUrl}` : ``}`)
      } else {
        const event = new CustomEvent(NEIGHBORHOOD_SELECTION_CHANGE, {
          detail: {
            city: selectedCity,
            neighborhoods: allNeighborhoodsSelected ? [] : selectedNeighborhoods
          }
        })
        window.dispatchEvent(event)
      }
    })
  }

  changeSelection(newSelection, onFinished) {
    this.setState({selectedNeighborhoods: newSelection}, onFinished)
  }

  handleClickOutside() {
    if (this.state.showCities) {
      this.toggleCitiesDisplay()
    }
  }

  getCities(data) {
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

  toggleCitiesDisplay() {
    if (!this.state.showCities) {
      log(LISTING_SEARCH_NEIGHBORHOOD_OPEN)
    }
    this.setState({showCities: !this.state.showCities})
  }

  getButtonText() {
    if (process.browser) {
      const {selectedNeighborhoods, selectedCity} = this.state
      const allNeighborhoodsSelected = selectedCity && isCitySelected(cities, selectedNeighborhoods, selectedCity.citySlug)
      if (selectedNeighborhoods && selectedNeighborhoods.length > 0 && !allNeighborhoodsSelected) {
        return arrayToString(selectedNeighborhoods)
      } else if (!selectedCity) {
        return DEFAULT_BUTTON_TEXT
      } else if (selectedCity || allNeighborhoodsSelected) {
        return selectedCity.name
      }
    }
    return DEFAULT_BUTTON_TEXT
  }

  render() {
    return (
      <Query query={GET_DISTRICTS} ssr={true}>
        {({data}) => {
          const availableCities = this.getCities(data)
          const buttonText = this.getButtonText()
          return (
            <SearchContainer
              ref={this.containerRef}
              onClick={this.props.onClick}
              mobile={this.props.mobile}
            >
              <InputWrapper>
                <InputContainer
                  onClick={this.toggleCitiesDisplay}
                  selected={this.state.showCities}
                >
                  <SearchTextContainer>
                    {this.props.onBackPressed ? (
                      <BackButton onClick={this.props.onBackPressed}>
                        <BackIcon name="arrow-left" color="dark" />
                      </BackButton>
                    ) : (
                      <Icon
                        name="map-marker-alt"
                        px={3}
                        pt={1}
                        size={21}
                        color="dark"
                      />
                    )}
                    <ButtonText
                      color={
                        buttonText === DEFAULT_BUTTON_TEXT ? 'grey' : 'dark'
                      }
                    >
                      {this.getButtonText()}
                    </ButtonText>
                  </SearchTextContainer>
                  <Col px={3} pt={1}>
                    <FontAwesomeIcon
                      icon={this.state.showCities ? AngleUp : AngleDown}
                      size="2x"
                      style={{fontSize: 24}}
                    />
                  </Col>
                </InputContainer>
              </InputWrapper>
              <PoseGroup>
                {this.state.showCities && (
                  <FadeInOut key={1}>
                    <CityContainer
                      cities={availableCities}
                      selectedNeighborhoods={this.state.selectedNeighborhoods}
                      selectedCity={this.state.selectedCity}
                      isCitySelected={this.isCitySelected}
                      selectCity={this.selectCity}
                      clear={this.clear}
                      apply={this.apply}
                      parentRef={this.containerRef.current}
                      fromHome={this.props.fromHome}
                      showAllCities={this.showAllCities}
                      fullscreen={this.props.fullscreen}
                    />
                    <Background />
                  </FadeInOut>
                )}
              </PoseGroup>
            </SearchContainer>
          )
        }}
      </Query>
    )
  }
}

NeighborhoodPicker.propTypes = {
  onClick: PropTypes.func,
  onBackPressed: PropTypes.func,
  mobile: PropTypes.bool,
  neighborhood: PropTypes.array,
  fromHome: PropTypes.bool,
  fullscreen: PropTypes.bool
}

export default enhanceWithClickOutside(NeighborhoodPicker)
