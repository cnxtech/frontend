import {get, getFile, post, put} from 'lib/request'
const slugify = require('slug')

const buildPayload = (data) => {
  return {
    listing: {
      complement: data.complement,
      type: data.type,
      description: data.description,
      price: data.price || 0,
      floor: data.floor,
      rooms: data.rooms,
      bathrooms: data.bathrooms,
      area: data.area,
      garage_spots: data.garageSpots || data.garage_spots,
      score: data.score,
      matterport_code: data.matterportCode || data.matterport_code,
      maintenance_fee: data.maintenance_fee,
      property_tax: data.property_tax
    },
    address: {
      street: data.street,
      street_number: data.streetNumber || data.street_number,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      postal_code: data.postalCode || data.postal_code,
      lat: data.lat,
      lng: data.lng,
      neighborhood_slug: slugify(data.neighborhood.toLowerCase())
    }
  }
}

const translatedKeys = {
  bairros: 'neighborhoods',
  area_minima: 'min_area',
  area_maxima: 'max_area',
  preco_maximo: 'max_price',
  preco_minimo: 'min_price',
  quartos_maximo: 'max_rooms',
  quartos_minimo: 'min_rooms',
  vagas_maximo: 'max_garage_spots',
  vagas_minimo: 'min_garage_spots'
}

// Transforms something like
// { bairros: 'Copacabana|Leblon', preco_maximo: '100000' }
// into
// { neighboorhood: ['Copacabana', 'Leblon'], max_price: '100000' }
const buildGetParams = function(query) {
  return Object.keys(query).reduce(function(previous, key) {
    const realKey = translatedKeys[key] || key
    const value = splitParam(query[key], key)
    return {...previous, [realKey]: value}
  }, {})
}

// Transforms something like
// { price: 'R$ 1.800,00', ... }
// into
// { price: 1800 }
export const formatListingData = function(listing, fields) {
  let listingFomatted = {...listing}

  for (const key of Object.keys(listingFomatted)) {
    if (fields.includes(key) && listingFomatted[key]) {
      listingFomatted[key] = parseInt(
        listingFomatted[key]
          .toString()
          .split(',')[0]
          .match(/\d+(?:\d\.\d+)?/g)
          .join('')
      )
    }
  }

  return listingFomatted
}

const splitParam = function(param, key) {
  if (key === 'bairros') {
    return param.split('|')
  }
  return param
}

export const getListings = async (jwt, query) => {
  const endpoint = '/listings'
  const params = buildGetParams(query)

  try {
    return await get(endpoint, jwt, params)
  } catch (error) {
    if (error.response && error.response.status === 422)
      throw new Error('Unknown error. Please try again.', error)
    else throw error
  }
}

export const getListing = async (id, jwt) => {
  try {
    const response = await get('/listings/' + id, jwt)
    return response
  } catch (error) {
    throw {
      message: error.message,
      status: error.response ? error.response.status : 500
    }
  }
}

export const getFeaturedListings = async () => {
  const endpoint = '/featured_listings'

  try {
    return await get(endpoint, null)
  } catch (error) {
    if (error.response && error.response.status === 422)
      throw new Error('Unknown error. Please try again.', error)
    else throw error
  }
}

export const getListingImages = async (id, jwt) => {
  try {
    const response = await getFile('/listings/' + id + '/download_images', jwt)
    return response
  } catch (error) {
    if (error.response && error.response.status === 422)
      throw new Error('Unknown error. Please try again.', error)
    else throw error
  }
}

export const createListing = async (data, jwt) => {
  const payload = buildPayload(data)
  try {
    const response = await post('/listings', payload, jwt)
    return response
  } catch (error) {
    throw error.response || error.message
  }
}

export const editListing = async (id, jwt) => {
  return get(`/listings/${id}/edit`, jwt)
}

export const updateListing = async (id, data, jwt) => {
  const payload = buildPayload(data)
  try {
    const response = await put(`/listings/${id}`, payload, jwt)
    return response
  } catch (error) {
    if (error.response && error.response.status === 422)
      throw new Error('Unknown error. Please try again.', error)
    else throw error
  }
}
