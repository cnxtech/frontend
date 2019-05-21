import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import View from '@emcasa/ui-dom/components/View'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import theme from 'config/theme'
import {log, LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL} from 'lib/logging'
import {
  isNeighborhoodSelected,
  updateSelection,
  selectCity,
  sortByPopularity
} from './selection'
import {CitiesWrapper, NeighborhoodButton} from './styles'

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

  getSelectedAndDeselectedNeighborhoods = () => {
    const {selectedCity, selectedNeighborhoods} = this.props
    const selectedNeighborhoodList = []
    let deselectedNeighborhoodList = []
    selectedCity &&
      selectedCity.neighborhoods.forEach((neighborhood, j) => {
        const isSelected = isNeighborhoodSelected(
          selectedNeighborhoods,
          neighborhood.nameSlug
        )
        const isNewSelection = isNeighborhoodSelected(
          this.props.selectedNeighborhoods,
          neighborhood.nameSlug
        )
        if (isSelected) {
          selectedNeighborhoodList.push(
            this.getNeighborhoodButton(j, isNewSelection, neighborhood)
          )
        } else {
          deselectedNeighborhoodList.push(
            this.getNeighborhoodButton(j, isNewSelection, neighborhood)
          )
        }
      })
    if (!selectedCity) {
      deselectedNeighborhoodList = sortByPopularity(deselectedNeighborhoodList)
    }

    return {selectedNeighborhoodList, deselectedNeighborhoodList}
  }

  render() {
    const {cities, selectCity, selectedCity} = this.props
    const {
      selectedNeighborhoodList,
      deselectedNeighborhoodList
    } = this.getSelectedAndDeselectedNeighborhoods()

    return (
      <CitiesWrapper>
        <Row flexDirection="column">
          <Col>
            <Row flexDirection="row" alignItems="center">
              {!selectedCity && <Text>Escolha uma cidade</Text>}
              {selectedCity && (
                <Fragment>
                  <Text>{selectedCity.name}</Text>
                  <Button
                    link
                    fontSize={theme.fontSizes[1]}
                    onClick={() => {
                      this.resetCurrentSelection()
                    }}
                  >
                    Trocar cidade
                  </Button>
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
                  {selectedNeighborhoodList.map((Item) => Item)}
                  {deselectedNeighborhoodList.map((Item) => Item)}
                </Fragment>
              )}
              {!selectedCity && (
                <Fragment>
                  {cities.map((city, i) => (
                    <View mr={2} mb={2} key={i}>
                      <NeighborhoodButton
                        active={
                          selectedCity &&
                          selectedCity.citySlug === city.citySlug
                        }
                        onClick={() => {
                          selectCity(city)
                        }}
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
