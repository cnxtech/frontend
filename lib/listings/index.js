const slugify = require('slug')
const {intToCurrency} = require('../../utils/text-utils')

const parseSlug = (params) => {
  const paramsWithId = {...params}
  const parameterToSplit = params.listingId
    ? params.listingId
    : params.streetwithId
  paramsWithId.id = parseInt(parameterToSplit.split('-').pop())
  return paramsWithId
}

const buildSlug = (listing, asPath) => {
  const {city, state, neighborhood, street} = listing.address
  const {id} = listing
  const urlSchema = [state, city, neighborhood, street, `id-${id}`]
  let slug =
    '/imoveis/' +
    urlSchema.map((component) => formatComponent(component)).join('/')
  if (asPath) {
    const paramsStart = asPath.indexOf('?')
    if (paramsStart > -1) {
      const paramsEnd = asPath.length - paramsStart
      const urlParams = asPath.substr(paramsStart, paramsEnd)
      slug += urlParams
    }
  }

  return slug
}

const buildNeighborhoodSlug = (listing) => {
  const {city, state, neighborhood} = listing.address
  const urlSchema = [state, city, neighborhood]
  let slug =
    '/imoveis/' +
    urlSchema.map((component) => formatComponent(component)).join('/')

  return slug
}

const formatComponent = (component) => slugify(component).toLowerCase()

const getListingsCoordinates = (listings) =>
  listings.map(({id, price, address: {lat, lng}}) => ({
    id,
    price,
    address: {lat, lng}
  }))

const filterListings = (listings = [], filters) => {
  const {
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    minRooms,
    maxRooms,
    minGarageSpots,
    maxGarageSpots,
    neighborhoods,
    types
  } = filters
  return listings.filter(
    ({
      price: lPrice,
      rooms: lRooms,
      area: lArea,
      garageSpots: lGarageSpots,
      type: lType,
      address: {neighborhood: lNeighborhood}
    }) => {
      let returnListing = true
      if (minPrice && lPrice < parseInt(minPrice)) returnListing = false

      if (maxPrice && lPrice > parseInt(maxPrice)) returnListing = false

      if (minArea && lArea < parseInt(minArea)) returnListing = false
      if (maxArea && lArea > parseInt(maxArea)) returnListing = false

      if (minRooms && lRooms < parseInt(minRooms)) returnListing = false
      if (maxRooms && lRooms > parseInt(maxRooms)) returnListing = false

      if (minGarageSpots && lGarageSpots < parseInt(minGarageSpots))
        returnListing = false
      if (maxGarageSpots && lGarageSpots > parseInt(maxGarageSpots))
        returnListing = false

      if (neighborhoods && neighborhoods.indexOf(lNeighborhood) === -1)
        returnListing = false

      if (types && types.indexOf(lType) === -1) returnListing = false

      return returnListing
    }
  )
}

const getListingId = (url) => {
  const urlMatch = url.match(/id-(\d+)/) || url.match(/(\d+)/)
  if (urlMatch && urlMatch.length > 0) {
    return urlMatch[1]
  }
  return null
}

const getListingSummary = (
  {area, rooms, suites, garageSpots},
  separator = ` ${String.fromCharCode(0x2043)} `
) => {
  return [
    area && `${area}m²`,
    rooms && `${rooms} quarto${plural(rooms)}`,
    suites && `${suites} suite${plural(suites)}`,
    garageSpots && `${garageSpots} vaga${plural(garageSpots)}`
  ]
    .filter(Boolean)
    .join(separator)
}

const getListingPrice = (listing) => {
  return intToCurrency(listing.price)
}

const plural = (item) => {
  return isNaN(item) || parseInt(item) !== 1 ? 's' : ''
}

module.exports = {
  buildSlug,
  buildNeighborhoodSlug,
  parseSlug,
  getListingsCoordinates,
  filterListings,
  getListingId,
  getListingSummary,
  getListingPrice,
  plural
}
