import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PoseGroup } from 'react-pose'
import Router from 'next/router'
import enhanceWithClickOutside from 'react-click-outside'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import AngleDown from '@fortawesome/fontawesome-pro-light/faAngleDown'
import AngleUp from '@fortawesome/fontawesome-pro-light/faAngleUp'
import * as Sentry from '@sentry/browser'
import Background from 'components/shared/Background'
import FadeInOut from 'components/shared/Animation/FadeInOut'
import Icon from '@emcasa/ui-dom/components/Icon'
import Col from '@emcasa/ui-dom/components/Col'
import CityContainer from './components/CityContainer'
import { GET_DISTRICTS } from 'graphql/listings/queries'
import { Query } from 'react-apollo'
import { cities } from 'constants/cities'
import { arrayToString } from 'utils/text-utils'
import {
  log,
  LISTING_SEARCH_NEIGHBORHOOD_OPEN,
  LISTING_SEARCH_NEIGHBORHOOD_APPLY,
  LISTING_SEARCH_NEIGHBORHOOD_CLEAR,
  LISTING_SEARCH_NEIGHBORHOOD_EXPAND,
  LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY
} from 'lib/logging'
import {
  addNeighborhoodsToQuery,
  getDerivedParams
} from 'utils/filter-params.js'
import {
  InputWrapper,
  InputContainer,
  SearchContainer,
  SearchTextContainer,
  BackIcon,
  BackButton,
  ButtonText
} from './styles'

const DEFAULT_BUTTON_TEXT = 'Escolha os bairros'

class NeighborhoodPicker extends Component {
  constructor(props) {
    super(props)
    this.getCities = this.getCities.bind(this)
    this.toggleCitiesDisplay = this.toggleCitiesDisplay.bind(this)
    this.changeSelection = this.changeSelection.bind(this)
    this.expand = this.expand.bind(this)
    this.clear = this.clear.bind(this)
    this.apply = this.apply.bind(this)
    this.getButtonText = this.getButtonText.bind(this)
    this.showAllCities = this.showAllCities.bind(this)

    const initialNeighborhoodSelection = props.query && props.query.bairros ? getDerivedParams(props.query).neighborhoods : []
    this.containerRef = React.createRef()

    this.state = {
      selectedNeighborhoods: initialNeighborhoodSelection,
      expanded: [],
      showCities: this.props.mobile
    }
  }

  expand(city) {
    log(LISTING_SEARCH_NEIGHBORHOOD_EXPAND, {city: city.citySlug})
    let newExpanded = this.state.expanded
    newExpanded.push(city)
    this.setState({
      expanded: newExpanded
    })
  }

  showAllCities() {
    log(LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY, {city: this.state.expanded[0].citySlug})
    this.setState({expanded: []})
  }

  clear() {
    log(LISTING_SEARCH_NEIGHBORHOOD_CLEAR)
    this.setState({selectedNeighborhoods: []}, () => {
      this.apply([])
    })
  }

  apply(newSelection) {
    this.changeSelection(newSelection, () => {
      log(LISTING_SEARCH_NEIGHBORHOOD_APPLY, {
        neighborhoods: this.state.selectedNeighborhoods,
        fromHome: this.props.fromHome
      })
      this.toggleCitiesDisplay()
      if (this.props.onBackPressed) {
        this.props.onBackPressed()
      }
      if (this.props.fromHome && this.state.selectedNeighborhoods.length === 0) {
        return
      }
      const currentQuery = this.props.query || {}
      const query = addNeighborhoodsToQuery(getDerivedParams(currentQuery), this.state.selectedNeighborhoods)
      Router.push(`/listings${query}`, `/imoveis${query}`, {shallow: true})
    })
  }

  changeSelection(newSelection, onFinished) {
    this.setState({ selectedNeighborhoods: newSelection }, onFinished)
  }

  handleClickOutside() {
    if (this.state.showCities) {
      this.toggleCitiesDisplay()
    }
  }

  getCities(data) {
    try {
      if (data) {
        let citiesNeighborhoods = cities
        citiesNeighborhoods.forEach((city) => city.neighborhoods = [])
        data.districts.forEach((item) => {
          citiesNeighborhoods.find((city) => city.citySlug === item.citySlug).neighborhoods.push(item)
        })
        citiesNeighborhoods.forEach((city) => city.neighborhoods.sort((n1, n2) => n1.nameSlug.localeCompare(n2.nameSlug)))
        return citiesNeighborhoods
      }
    } catch (e) {
      Sentry.captureException(e)
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
      const selected = getDerivedParams(Router.query).neighborhoods
      if (selected && selected.length > 0) {
        return arrayToString(selected)
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
            <SearchContainer innerRef={this.containerRef} onClick={this.props.onClick} mobile={this.props.mobile}>
              <InputWrapper>
                <InputContainer onClick={this.toggleCitiesDisplay} selected={this.state.showCities}>
                  <SearchTextContainer>
                    {this.props.onBackPressed ?
                      <BackButton onClick={this.props.onBackPressed}>
                        <BackIcon name="arrow-left" color="dark" />
                      </BackButton>
                      :
                      <Icon name="map-marker-alt" px={3} pt={1} size={21} color="dark" />
                    }
                    <ButtonText color={buttonText === DEFAULT_BUTTON_TEXT ? 'grey' : 'dark'}>{this.getButtonText()}</ButtonText>
                  </SearchTextContainer>
                  <Col px={3} pt={1}>
                    <FontAwesomeIcon icon={this.state.showCities ? AngleUp : AngleDown} size="2x" style={{fontSize: 24}} />
                  </Col>
                </InputContainer>
              </InputWrapper>
              <PoseGroup>
              {this.state.showCities &&
                <FadeInOut key={1}>
                  <CityContainer
                    cities={availableCities}
                    selectedNeighborhoods={this.state.selectedNeighborhoods}
                    expanded={this.state.expanded}
                    selectCity={this.selectCity}
                    isCitySelected={this.isCitySelected}
                    expand={this.expand}
                    clear={this.clear}
                    apply={this.apply}
                    parentRef={this.containerRef.current}
                    fromHome={this.props.fromHome}
                    showAllCities={this.showAllCities}
                    fullscreen={this.props.fullscreen}
                  />
                  <Background />
                </FadeInOut>
              }
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
  query: PropTypes.object,
  fromHome: PropTypes.bool,
  fullscreen: PropTypes.bool
}

export default enhanceWithClickOutside(NeighborhoodPicker)
