import difference from 'lodash/difference'
import union from 'lodash/union'
import sortBy from 'lodash/sortBy'
import { clone } from 'utils/clone'

/**
 * Adds or removes a neighborhood slug from the current selection. Returns the new
 * array of neighborhood slugs after the change.
 *
 * @param selected currently selected neighborhood slugs.
 * @param neighborhood neighborhood slug to add or remove from selection.
 */
function updateSelection(selected, neighborhood) {
  let selectedNeighborhoods = clone(selected)
  if (selectedNeighborhoods.includes(neighborhood)) {
    selectedNeighborhoods = selectedNeighborhoods.filter((slug) => slug !== neighborhood)
  } else {
    selectedNeighborhoods.push(neighborhood)
  }
  return selectedNeighborhoods
}

/**
 * Adds or removes every neighborhood slug of a city from the current selection.
 * Returns the new array of neighborhood slugs after the change.
 *
 * If every neighborhood in a city is already selected, we deselect all of them instead.
 *
 * @param cities object containing all available cities and their neighborhoods.
 * @param selected currently selected neighborhood slugs.
 * @param citySlug slug of the city being selected/deselected.
 */
function selectCity(cities, selected, citySlug) {
  // Get all neighborhoods of a city
  let cityNeighborhoods = []
  cities.forEach((city) => {
    if (city.citySlug === citySlug) {
      cityNeighborhoods = getNeighborhoodsSlugs(city.neighborhoods)
    }
  })

  if (isCitySelected(cities, selected, citySlug)) {
    // Remove all neighborhoods of this city from the current selection
    return difference(selected, cityNeighborhoods)
  } else {
    // Add all neighborhoods of this city to the current selection
    const diff = difference(selected, cityNeighborhoods)
    return union(diff, cityNeighborhoods)
  }
}

function isNeighborhoodSelected(selected, neighborhood) {
  return selected.includes(neighborhood)
}

/**
 * Returns true if every neighborhood of the given city is selected.
 *
 * @param cities object containing all available cities and their neighborhoods.
 * @param selected currently selected neighborhood slugs.
 * @param citySlug slug of the city being selected/deselected.
 */
function isCitySelected(cities, selected, citySlug) {
  let included = false
  selected.sort()
  cities.forEach((city) => {
    if (city.citySlug === citySlug) {
      let neighborhoodSlugs = getNeighborhoodsSlugs(city.neighborhoods)
      included = difference(neighborhoodSlugs, selected).length === 0
    }
  })
  return included
}

/**
 * Returns an array of neighborhood slugs (strings) given list of neighborhood objects.
 *
 * @param neighborhoods list of neighborhood objects.
 */
function getNeighborhoodsSlugs(neighborhoods) {
  return neighborhoods.map((neighborhood) => {
    return neighborhood.nameSlug
  })
}

/**
 * Returns a list of neighborhoods ordered by popularity.
 *
 * @param neighborhoodButtons list of neighborhood buttons to be displayed.
 */
function sortByPopularity(neighborhoodButtons) {
  return sortBy(neighborhoodButtons, (button) => {
    let index = popularNeighborhoods.indexOf(button.props.neighborhood.nameSlug)
    if (index === -1) {
      // Push neighborhoods not in the popular list to the end
      index = neighborhoodButtons.length
    }
    return index
  })
}

const popularNeighborhoods = [
  'ipanema',
  'leblon',
  'botafogo'
]

export {
  updateSelection,
  isNeighborhoodSelected,
  isCitySelected,
  selectCity,
  sortByPopularity
}
