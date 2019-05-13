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

const MAX_INITIAL_ITEMS = 3

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
      <View mr={2} mb={2} neighborhood={neighborhood}>
        <NeighborhoodButton
          key={key}
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

  updateCurrentSelection(neighborhood) {
    const newSelection = updateSelection(this.state.currentSelection, neighborhood)
    this.setState({ currentSelection: newSelection })
  }

  render() {
    const {
      cities,
      expand,
      expanded,
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
    return (
      <CitiesWrapper
        p={2}
        width={pos.width}
        top={(pos.top + topOffset)}
        left={pos.left}
        fromHome={this.props.fromHome}
        fullscreen={this.props.fullscreen}
      >
        {cities.map((city, i) => {
          // Restrict view to only the currently expanded city
          const isExpanded = expanded && expanded.length > 0
          if (isExpanded) {
            if (city.citySlug !== expanded[0].citySlug) {
              return
            }
          }
          let showExpandAll = false
          let isCityExpanded = expanded.includes(city)
          const citySelected = isCitySelected(cities, this.state.currentSelection, city.citySlug)
          const showSeparator = i <= cities.length - 1

          const selectedNeighborhoodList = []
          let deselectedNeighborhoodList = []
          city.neighborhoods.forEach((neighborhood, j) => {
            const isSelected = isNeighborhoodSelected(selectedNeighborhoods, neighborhood.nameSlug)
            const isNewSelection = isNeighborhoodSelected(this.state.currentSelection, neighborhood.nameSlug)
            if (isSelected) {
              selectedNeighborhoodList.push(this.getNeighborhoodButton(j, isNewSelection, neighborhood))
            } else {
              deselectedNeighborhoodList.push(this.getNeighborhoodButton(j, isNewSelection, neighborhood))
            }
          })
          if (!isExpanded) {
            deselectedNeighborhoodList = sortByPopularity(deselectedNeighborhoodList)
          }

          let buttonsRendered = 0

          return (
            <Row key={i} flexDirection="column">
              <Col>
                <Row flexDirection="row" alignItems="center">
                  <Text fontSize="small">{city.name}</Text>
                  {isExpanded && <Button link fontSize={theme.fontSizes[1]} onClick={this.props.showAllCities}>Trocar cidade</Button>}
                </Row>
              </Col>
              <Col>
                <Row flexWrap="wrap">
                  <View mr={2} mb={2}>
                    <NeighborhoodButton
                      active={citySelected}
                      onClick={() => {this.selectCity(cities, city.citySlug)}}>
                        Todos
                      </NeighborhoodButton>
                  </View>
                  <>
                    {selectedNeighborhoodList.map((Item) => {
                      buttonsRendered++
                      showExpandAll = buttonsRendered > MAX_INITIAL_ITEMS
                      if (!isCityExpanded && showExpandAll) {
                        return null
                      }
                      return Item
                    })}
                    {deselectedNeighborhoodList.map((Item) => {
                      buttonsRendered++
                      showExpandAll = buttonsRendered > MAX_INITIAL_ITEMS
                      if (!isCityExpanded && showExpandAll) {
                        return null
                      }
                      return Item
                    })}
                  </>
                  {(showExpandAll && !isCityExpanded) && <Button p={0} link onClick={() => {expand(city)}}>Ver mais</Button>}
                </Row>
              </Col>
              {showSeparator && <Col mt={2}><Separator /></Col>}
            </Row>
          )
        })}
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
  expand: PropTypes.func.isRequired,
  expanded: PropTypes.array.isRequired,
  selectedNeighborhoods: PropTypes.array.isRequired,
  clear: PropTypes.func.isRequired,
  apply: PropTypes.func.isRequired,
  parentRef: PropTypes.object.isRequired,
  showAllCities: PropTypes.func.isRequired,
  fromHome: PropTypes.bool,
  fullscreen: PropTypes.bool
}

export default CityContainer
