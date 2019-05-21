import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Icon from '@emcasa/ui-dom/components/Icon'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import {log, LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL} from 'lib/logging'
import {
  isNeighborhoodSelected,
  updateSelection,
  selectCity,
  sortByPopularity
} from './selection'
import {CitiesWrapper, NeighborhoodButton, LinkButton} from './styles'

class CityContainer extends Component {
  static defaultProps = {
    cities: []
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
    const elems = []
    selectedCity &&
      selectedCity.neighborhoods.forEach((neighborhood, j) => {
        const isSelected = isNeighborhoodSelected(
          selectedNeighborhoods,
          neighborhood.nameSlug
        )
        elems.push(this.getNeighborhoodButton(j, isSelected, neighborhood))
      })

    return elems
  }

  render() {
    const {cities, selectCity, selectedCity} = this.props
    const neighborhoods = this.getSelectedNeighborhoods()

    return (
      <CitiesWrapper>
        <Row flexDirection="column">
          <Col>
            <Row flexDirection="row" alignItems="center">
              {!selectedCity && <Text>Escolha uma cidade</Text>}
              {selectedCity && (
                <Fragment>
                  <Icon name="map-marker-alt" size={24} mr={2} color="pink" />
                  <Text fontWeight="bold" fontSize="small">
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
