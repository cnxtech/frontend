import omit from 'lodash/omit'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import ParamsMapper from 'utils/params-mapper'

const filterValid = (object) => omit(object, [undefined])

function joinParam(param) {
  return param
    .map(function(item) {
      // If neighborhoods come from the url, such as if a filter has been applied
      // from the home page, the neighborhood name is passed simply as `item`.
      // If the neighborhood comes from the multiselect, the neighborhood name
      // is sent as `item.value`
      return item.value ? item.value : item
    })
    .join('|')
}

function treatMinPrice(price) {
  if (price && price.min) return `preco_minimo=${price.min}`
}

function treatMaxPrice(price) {
  if (price && price.max) return `preco_maximo=${price.max}`
}

function treatMinArea(area) {
  if (area && area.min) return `area_minima=${area.min}`
}

function treatMaxArea(area) {
  if (area && area.max) return `area_maxima=${area.max}`
}

function treatMinRooms(rooms) {
  if (rooms && rooms.min) return `quartos_minimo=${rooms.min}`
}

function treatMaxRooms(rooms) {
  if (rooms && rooms.max) return `quartos_maximo=${rooms.max}`
}

function treatMinGarageSpots(garageSpots) {
  if (garageSpots && typeof(garageSpots.min) === 'number') return `vagas_minimo=${garageSpots.min}`
}

function treatMaxGarageSpots(garageSpots) {
  if (garageSpots && typeof(garageSpots.max) === 'number') return `vagas_maximo=${garageSpots.max}`
}

function treatNeighborhoods(neighborhoods) {
  if (neighborhoods && neighborhoods.length > 0) return `bairros=${joinParam(neighborhoods)}`
}

function treatPropertyType(types) {
  if (types && types.length > 0) return `tipos=${joinParam(types)}`
}

/**
 * Generates a query string with the given Filters.
 *
 * @param filters
 */
export function treatParams({
  price,
  area,
  rooms,
  garageSpots,
  neighborhoods,
  types
}) {
  return [
    treatMinPrice(price),
    treatMaxPrice(price),
    treatMinArea(area),
    treatMaxArea(area),
    treatMinRooms(rooms),
    treatMaxRooms(rooms),
    treatMinGarageSpots(garageSpots),
    treatMaxGarageSpots(garageSpots),
    treatNeighborhoods(neighborhoods),
    treatPropertyType(types)
  ]
    .filter((n) => n)
    .join('&')
}

const splitParam = (param) => (param ? param.split('|') : [])

/**
 * @deprecated. Use `getNewFiltersFromQuery` instead.
 */
export const getFiltersFromQuery = ({
  preco_minimo,
  preco_maximo,
  area_minima,
  area_maxima,
  vagas_minimo,
  vagas_maximo,
  quartos_minimo,
  quartos_maximo,
  bairros,
  tipos
}) => {
  const filters = {
    minPrice: parseInt(preco_minimo),
    maxPrice: parseInt(preco_maximo),
    minArea: parseInt(area_minima),
    maxArea: parseInt(area_maxima),
    minRooms: parseInt(quartos_minimo),
    maxRooms: parseInt(quartos_maximo),
    minGarageSpots: parseInt(vagas_minimo),
    maxGarageSpots: parseInt(vagas_maximo),
    neighborhoods:
      bairros &&
      splitParam(bairros).map(
        (neighborhood) =>
          neighborhood.value ? neighborhood.value : neighborhood
      ),
    types:
      tipos && splitParam(tipos).map((type) => (type.value ? type.value : type))
  }

  return pickBy(filters, identity)
}

/**
 * Returns a Filter object given the request's query string and url parameters.
 *
 * @param query query string object.
 * @param params params object.
 */
export const getNewFiltersFromQuery = ({
  preco_minimo,
  preco_maximo,
  area_minima,
  area_maxima,
  vagas_minimo,
  vagas_maximo,
  quartos_minimo,
  quartos_maximo,
  bairros,
  tipos
}, params) => {
  const price = preco_minimo || preco_maximo ? {
    min: parseInt(preco_minimo),
    max: parseInt(preco_maximo)
  } : null
  const area = area_minima || area_maxima ? {
    min: parseInt(area_minima),
    max: parseInt(area_maxima)
  } : null
  const rooms = quartos_minimo || quartos_maximo ? {
    min: parseInt(quartos_minimo),
    max: parseInt(quartos_maximo)
  } : null
  const garageSpots = vagas_minimo || vagas_maximo ? {
    min: parseInt(vagas_minimo),
    max: parseInt(vagas_maximo)
  } : null
  const types = tipos && splitParam(tipos).map((type) => (type.value ? type.value : type))
  const neighborhoods = bairros && splitParam(bairros).map((neighborhood) => neighborhood)
  const neighborhoodsSlugs = params && params.neighborhood ? [params.neighborhood] : null
  const citySlug = params && params.city ? params.city : null
  const filters = {
    price,
    area,
    rooms,
    garageSpots,
    types,
    neighborhoods,
    neighborhoodsSlugs,
    citySlug
  }

  return pickBy(filters, identity)
}

/**
 * @deprecated. Use `getListingFiltersFromState` instead.
 */
export const getFiltersFromFilters = ({
  price,
  area,
  garageSpots,
  rooms,
  neighborhoods,
  types
}) => {
  const filters = {
    minPrice: price && parseInt(price.min),
    maxPrice: price && parseInt(price.max),
    minArea: area && parseInt(area.min),
    maxArea: area && parseInt(area.max),
    minRooms: rooms && parseInt(rooms.min),
    maxRooms: rooms && parseInt(rooms.max),
    minGarageSpots: garageSpots && parseInt(garageSpots.min),
    maxGarageSpots: garageSpots && parseInt(garageSpots.max),
    neighborhoods:
      neighborhoods &&
      neighborhoods.length > 0 &&
      neighborhoods.map(
        (neighborhood) =>
          neighborhood.value ? neighborhood.value : neighborhood
      ),
    types:
      types &&
      types.length > 0 &&
      types.map((type) => (type.value ? type.value : type))
  }

  return pickBy(filters, identity)
}

/**
 * Returns a filter object to be passed to the Listing query.
 *
 * @param filters Listing Filters selected by the user.
 */
export const getListingFiltersFromState = (filterState) => {
  if (!filterState || Object.keys(filterState).length === 0) {
    return {}
  }
  const {
    price,
    area,
    garageSpots,
    rooms,
    neighborhoods,
    stateSlug,
    citySlug,
    tagsSlug,
    types
  } = filterState
  const filters = {
    minPrice: price && parseInt(price.min),
    maxPrice: price && parseInt(price.max),
    minArea: area && parseInt(area.min),
    maxArea: area && parseInt(area.max),
    minRooms: rooms && parseInt(rooms.min),
    maxRooms: rooms && parseInt(rooms.max),
    minGarageSpots: garageSpots && parseInt(garageSpots.min),
    maxGarageSpots: garageSpots && parseInt(garageSpots.max),
    citySlug,
    [citySlug ? 'citiesSlug' : undefined]: citySlug ? [citySlug] : undefined,
    stateSlug,
    tagsSlug,
    types:
      types &&
      types.length > 0 &&
      types.map((type) => (type.value ? type.value : type)),
    neighborhoodsSlugs:
      neighborhoods &&
      neighborhoods.length > 0 &&
      neighborhoods.map((neighborhood) => neighborhood)
  }

  return pickBy(filters, (value) => value !== undefined && value !== null && ((typeof(value) === 'number' && !isNaN(value)) || typeof(value) === 'object'))
}

/**
 * Reads location info (state, city, neighborhood) from a given URL.
 *
 * @param asPath url
 */
export const getLocationFromPath = (asPath) => {
  const locationString = asPath.split(/\/imoveis\/(mapa\/)?/)[1]
  if (locationString) {
    const urlParts = locationString.split('/')
    const state = urlParts[0]
    const city = urlParts[1]
    let rest = locationString.split(`${state}/${city}/`)[1]
    return ParamsMapper.mapUrlToParams({state, city, rest})
  }
  return null
}

/**
 * Returns a filter object given a query object.
 *
 * @param query nextjs' query object.
 */
export const getDerivedParams = ({
  preco_minimo,
  preco_maximo,
  area_minima,
  area_maxima,
  vagas_minimo,
  vagas_maximo,
  quartos_minimo,
  quartos_maximo,
  bairros,
  tipos
}) => {
  return filterValid({
    [preco_minimo && preco_maximo ? 'price' : undefined]: {
      min: parseInt(preco_minimo),
      max: parseInt(preco_maximo)
    },
    [area_minima && area_maxima ? 'area' : undefined]: {
      min: parseInt(area_minima),
      max: parseInt(area_maxima)
    },
    [quartos_minimo || quartos_maximo ? 'rooms' : undefined]: filterValid({
      [quartos_minimo ? 'min' : undefined]: parseInt(quartos_minimo),
      [quartos_maximo ? 'max' : undefined]: parseInt(quartos_maximo)
    }),
    [vagas_minimo || vagas_maximo ? 'garageSpots' : undefined]: filterValid({
      [vagas_minimo ? 'min' : undefined]: parseInt(vagas_minimo),
      [vagas_maximo ? 'max' : undefined]: parseInt(vagas_maximo)
    }),
    [bairros && splitParam(bairros).length > 0 ? 'neighborhoods' : undefined]: splitParam(bairros),
    [tipos && splitParam(tipos).length > 0 ? 'types' : undefined]: splitParam(tipos)
  })
}

/**
 * Adds the list of selected neighborhoods to the current search query. This is
 * done separately because the Neighborhood Search component is separated from
 * the Listing Filters.
 *
 * @param filters current filters.
 * @param selectedNeighborhoods array of selected neighborhoods.
 */
export const addNeighborhoodsToQuery = (filters, selectedNeighborhoods) => {
  filters.neighborhoods = selectedNeighborhoods
  return `?${treatParams(filters)}`
}
