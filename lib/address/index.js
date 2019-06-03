import {filterComponent} from '@emcasa/places-autocomplete/helpers'

/**
 * Given Google's addressData, return EmCasa's addressInput object.
 */
const getAddressInput = (addressData) => {
  const {address_components: components} = addressData
  const neighborhood = filterComponent(components, 'sublocality_level_1').long_name
  const street = filterComponent(components, 'route').long_name
  const streetNumber = filterComponent(components, 'street_number').long_name
  const state = filterComponent(components, 'administrative_area_level_1').short_name
  const city = filterComponent(components, 'administrative_area_level_2').long_name
  const postalCode = filterComponent(components, 'postal_code').long_name

  return {
    city,
    lat: addressData.geometry.location.lat,
    lng: addressData.geometry.location.lng,
    neighborhood,
    postalCode,
    street,
    streetNumber,
    state
  }
}

export {
  getAddressInput
}
