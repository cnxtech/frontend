import * as Sentry from '@sentry/browser'
import { ESTIMATE_PRICE } from 'graphql/listings/mutations'

/**
 * Returns the approximate listing price.
 */
const estimatePrice = async (apolloClient, pricingInput) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ESTIMATE_PRICE,
      variables: pricingInput
    })

    if (data && data.requestPriceSuggestion) {
      const {id, suggestedPrice} = data.requestPriceSuggestion
      return {
        result: {
          id,
          suggestedPrice: parseInt(suggestedPrice)
        },
        error: null
      }
    }
  } catch (e) {
    Sentry.captureException(e)
    return {
      result: null,
      error: 'Ocorreu um erro. Por favor, tente novamente.'
    }
  }
}

/**
 * Creates the input object for the estimatePrice query.
 */
const getPricingInput = (addressInput, homeDetails, rooms, phone, userInfo) => {
  const area = parseInt(homeDetails.area)
  const { bathrooms, bedrooms, spots } = rooms
  let name = phone && phone.name ? phone.name : null
  if (!name) {
    name = userInfo && userInfo.name ? userInfo.name : null
  }

  return {
    address: addressInput,
    area,
    bathrooms,
    rooms: bedrooms,
    name: name,
    garageSpots: spots,
    isCovered: true
  }
}

export {
  estimatePrice,
  getPricingInput
}
