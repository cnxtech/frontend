import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import View from '@emcasa/ui-dom/components/View'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import theme from 'config/theme'
import {
  log,
  LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL
} from 'lib/logging'
import {
  isNeighborhoodSelected,
  updateSelection,
  isCitySelected,
  selectCity,
  sortByPopularity
} from './selection'
import {
  CitiesWrapper,
  NeighborhoodButton,
  Separator
} from './styles'

class CityContainer extends Component {
  static defaultProps = {
    cities: []
  }

  constructor(props) {
    super(props)
    this.getNeighborhoodButton = this.getNeighborhoodButton.bind(this)
    this.updateCurrentSelection = this.updateCurrentSelection.bind(this)
    this.selectCity = this.selectCity.bind(this)
    this.state = {
      currentSelection: []
    }
  }

  componentDidMount() {
    this.setState({
      currentSelection: this.props.selectedNeighborhoods
    })
  }

  selectCity(cities, citySlug) {
    log(LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL, {city: citySlug})
    const newSelection = selectCity(cities, this.state.currentSelection, citySlug)
    this.setState({ currentSelection: newSelection })
  }

  getNeighborhoodButton(key, isNewSelection, neighborhood) {
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
    this.setState({currentSelection: []})
  }

  updateCurrentSelection(neighborhood) {
    const newSelection = updateSelection(this.state.currentSelection, neighborhood)
    this.setState({ currentSelection: newSelection })
  }

  render() {
    const {
      cities,
      selectCity,
      selectedCity,
      selectedNeighborhoods,
      clear,
      apply,
      parentRef
    } = this.props

    let pos = {}
    if (parentRef) {
      const rects = parentRef.getClientRects()
      if (rects && rects.length > 0) {
        pos = rects[0]
      }
    }
    const topOffset = process.browser && window ? window.scrollY : 0

    const selectedNeighborhoodList = []
    let deselectedNeighborhoodList = []
    selectedCity && selectedCity.neighborhoods.forEach((neighborhood, j) => {
      const isSelected = isNeighborhoodSelected(selectedNeighborhoods, neighborhood.nameSlug)
      const isNewSelection = isNeighborhoodSelected(this.state.currentSelection, neighborhood.nameSlug)
      if (isSelected) {
        selectedNeighborhoodList.push(this.getNeighborhoodButton(j, isNewSelection, neighborhood))
      } else {
        deselectedNeighborhoodList.push(this.getNeighborhoodButton(j, isNewSelection, neighborhood))
      }
    })
    if (!selectedCity) {
      deselectedNeighborhoodList = sortByPopularity(deselectedNeighborhoodList)
    }

    return (
      <CitiesWrapper
        p={2}
        width={pos.width}
        top={(pos.top + topOffset)}
        left={pos.left}
        fromHome={this.props.fromHome}
        fullscreen={this.props.fullscreen}
      >
        <Row flexDirection="column">
          <Col>
            <Row flexDirection="row" alignItems="center" mt={selectedCity ? 0 : 4}>
              {selectedCity &&
                <>
                  <Text>{selectedCity.name}</Text>
                  <Button link fontSize={theme.fontSizes[1]} onClick={() => {this.resetCurrentSelection(); this.props.showAllCities();}}>Trocar cidade</Button>
                </>
              }
            </Row>
          </Col>
          <Col>
            <Row flexWrap="wrap">
              {selectedCity &&
                <>
                  <View mr={2} mb={2}>
                    <NeighborhoodButton onClick={() => {this.selectCity(cities, selectedCity.citySlug)}}>
                      Todos
                    </NeighborhoodButton>
                  </View>
                  {selectedNeighborhoodList.map((Item) => Item)}
                  {deselectedNeighborhoodList.map((Item) => Item)}
                </>}
              {!selectedCity &&
                <>
                  {cities.map((city, i) =>
                    <View mr={2} mb={2} key={i}>
                      <NeighborhoodButton
                        active={selectedCity && selectedCity.citySlug === city.citySlug}
                        onClick={() => {selectCity(city)}}>
                          {city.name}
                      </NeighborhoodButton>
                    </View>
                  )}
                </>
              }
            </Row>
          </Col>
          <Col mt={2}><Separator /></Col>
        </Row>
        <Row justifyContent="space-between">
          <Button p={0} link color="dark" onClick={clear}>Limpar</Button>
          <Button p={0} link onClick={() => {apply(this.state.currentSelection)}}>{this.props.fromHome ? 'Pesquisar' : 'Aplicar'}</Button>
        </Row>
      </CitiesWrapper>
    )
  }
}

CityContainer.propTypes = {
  cities: PropTypes.array.isRequired,
  selectCity: PropTypes.func.isRequired,
  selectedCity: PropTypes.object,
  selectedNeighborhoods: PropTypes.array.isRequired,
  clear: PropTypes.func.isRequired,
  apply: PropTypes.func.isRequired,
  parentRef: PropTypes.object.isRequired,
  showAllCities: PropTypes.func.isRequired,
  fromHome: PropTypes.bool,
  fullscreen: PropTypes.bool
}

export default CityContainer
