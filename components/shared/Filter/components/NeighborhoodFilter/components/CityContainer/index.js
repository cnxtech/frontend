import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Icon from '@emcasa/ui-dom/components/Icon'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import {log, LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL} from 'lib/logging'
import {isNeighborhoodSelected, updateSelection, selectCity} from './selection'

import {
  CitiesWrapper,
  NeighborhoodButton,
  LinkButton,
  RowMobile,
  LinkButtonMobile,
  SecondaryButton
} from './styles'
const NUMBER_OF_INITIAL_NEIGHBORHOOD_TO_SHOW = 6
class CityContainer extends Component {
  static defaultProps = {
    cities: []
  }

  state = {
    isShowAll: false
  }

  selectAllNeighborhoodInCity = (cities, citySlug) => {
    log(LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL, {city: citySlug})
    const newSelection = selectCity(
      cities,
      this.props.selectedNeighborhoods,
      citySlug
    )
    this.props.selectNeighborhoods(newSelection)
  }

  getNeighborhoodButton = (key, isNewSelection, neighborhood) => {
    return (
      <View mr={2} mb={2} neighborhood={neighborhood} key={key}>
        <NeighborhoodButton
          active={isNewSelection}
          onClick={() => {
            this.updateCurrentSelection(neighborhood.nameSlug)
          }}
          height="tall"
          fontSize="small"
        >
          {neighborhood.name}
        </NeighborhoodButton>
      </View>
    )
  }

  resetCurrentSelection = () => {
    const {showAllCities, selectNeighborhoods} = this.props
    selectNeighborhoods([])
    showAllCities()
  }

  updateCurrentSelection = (neighborhood) => {
    const newSelection = updateSelection(
      this.props.selectedNeighborhoods,
      neighborhood
    )
    this.props.selectNeighborhoods(newSelection)
  }

  getSelectedNeighborhoods = () => {
    const {selectedCity, selectedNeighborhoods} = this.props
    const {isShowAll} = this.state
    const elems = []
    if (selectedCity) {
      const neighborhoods = isShowAll
        ? selectedCity.neighborhoods
        : selectedCity.neighborhoods.slice(
          0,
          NUMBER_OF_INITIAL_NEIGHBORHOOD_TO_SHOW - 1
        )

      neighborhoods.forEach((neighborhood, j) => {
        const isSelected = isNeighborhoodSelected(
          selectedNeighborhoods,
          neighborhood.nameSlug
        )
        elems.push(this.getNeighborhoodButton(j, isSelected, neighborhood))
      })
    }
    return elems
  }

  isDisplayShowHideButtons = () => {
    const {selectedCity} = this.props
    return (
      selectedCity &&
      selectedCity.neighborhoods.length > NUMBER_OF_INITIAL_NEIGHBORHOOD_TO_SHOW
    )
  }

  isDisplayShowMoreButton = () => {
    return this.isDisplayShowHideButtons() && !this.state.isShowAll
  }

  isDisplayShowLessButton = () => {
    return this.isDisplayShowHideButtons() && this.state.isShowAll
  }

  changeShowAllState = (newState = false) => {
    this.setState({isShowAll: newState})
  }

  showMoreButton = () => {
    return (
      <SecondaryButton
        link
        height="tall"
        onClick={() => {
          this.changeShowAllState(true)
        }}
      >
        ver todos
      </SecondaryButton>
    )
  }

  showLessButton = () => {
    return (
      <SecondaryButton
        link
        height="tall"
        onClick={() => {
          this.changeShowAllState(false)
        }}
      >
        ver menos
      </SecondaryButton>
    )
  }

  render() {
    const {cities, selectCity, selectedCity} = this.props
    const neighborhoods = this.getSelectedNeighborhoods()
    const isDisplayShowMoreBtn = this.isDisplayShowMoreButton()
    const isDisplayShowLessBtn = this.isDisplayShowLessButton()
    return (
      <CitiesWrapper>
        <Row flexDirection="column">
          <Col>
            <Row flexDirection="row" alignItems="center">
              {!selectedCity && <Text>Escolha uma cidade</Text>}
              {selectedCity && (
                <Fragment>
                  <Icon name="map-marker-alt" size={24} mr={2} color="pink" />
                  <Text
                    fontWeight="bold"
                    flexDirection="column"
                    fontSize="small"
                  >
                    Você está em {selectedCity.name}
                  </Text>
                  <LinkButton
                    link
                    fontSize="small"
                    height="tall"
                    p={0}
                    ml={1}
                    onClick={() => {
                      this.resetCurrentSelection()
                    }}
                  >
                    trocar cidade
                  </LinkButton>
                </Fragment>
              )}
            </Row>
            <RowMobile>
              {selectedCity && (
                <LinkButtonMobile
                  link
                  fontSize="small"
                  p={0}
                  ml={1}
                  onClick={() => {
                    this.resetCurrentSelection()
                  }}
                >
                  trocar cidade
                </LinkButtonMobile>
              )}
            </RowMobile>
          </Col>
          <Col>
            <Row flexWrap="wrap">
              {selectedCity && (
                <Fragment>
                  <View mr={2} mb={2}>
                    <NeighborhoodButton
                      height="tall"
                      fontSize="small"
                      onClick={() => {
                        this.selectAllNeighborhoodInCity(
                          cities,
                          selectedCity.citySlug
                        )
                      }}
                    >
                      Todos
                    </NeighborhoodButton>
                  </View>
                  {neighborhoods.map((Item) => Item)}
                  {isDisplayShowMoreBtn && this.showMoreButton()}
                  {isDisplayShowLessBtn && this.showLessButton()}
                </Fragment>
              )}
              {!selectedCity && (
                <Fragment>
                  {cities.map((city, i) => (
                    <View mr={2} mb={2} key={i}>
                      <NeighborhoodButton
                        fontSize="small"
                        active={
                          selectedCity &&
                          selectedCity.citySlug === city.citySlug
                        }
                        onClick={() => {
                          selectCity(city)
                        }}
                        height="tall"
                      >
                        {city.name}
                      </NeighborhoodButton>
                    </View>
                  ))}
                </Fragment>
              )}
            </Row>
          </Col>
        </Row>
      </CitiesWrapper>
    )
  }
}

CityContainer.propTypes = {
  cities: PropTypes.array.isRequired,
  selectCity: PropTypes.func.isRequired,
  selectNeighborhoods: PropTypes.func.isRequired,
  selectedCity: PropTypes.object,
  selectedNeighborhoods: PropTypes.array.isRequired,
  showAllCities: PropTypes.func.isRequired
}

export default CityContainer
