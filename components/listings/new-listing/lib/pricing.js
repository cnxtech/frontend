import {captureException} from '@sentry/browser'
import {getAddressInput} from 'lib/address'
import {estimatePrice, getPricingInput} from 'lib/listings/pricing'
import {
  log,
  getSellerEventPrefix,
  SELLER_ONBOARDING_PRICING_SUCCESS,
  SELLER_ONBOARDING_PRICING_FAILED
} from 'lib/logging'

export const requestPricing = async (apolloClient, userInfo, {homeDetails, rooms, location, pricing, updatePricing, evaluation}) => {
  // Prepare input
  const addressInput = getAddressInput(location.addressData)
  const pricingInput = getPricingInput(addressInput, homeDetails, rooms, userInfo)

  // Run mutation
  const response = await estimatePrice(apolloClient, pricingInput)
  if (response.error) {
    captureException(new Error(response.error))
    return response
  }

  // Handle result
  if (response.result) {
    const {id, suggestedPrice, userPrice} = response.result
    if (suggestedPrice) {
      log(`${getSellerEventPrefix(evaluation)}${SELLER_ONBOARDING_PRICING_SUCCESS}`, {
        name: userInfo.name,
        phone: userInfo.phone,
        priceRequestId: id,
        pricingInput,
        suggestedPrice: suggestedPrice
      })
    } else {
      log(`${getSellerEventPrefix(evaluation)}${SELLER_ONBOARDING_PRICING_FAILED}`, {
        name: userInfo.name,
        phone: userInfo.phone,
        pricingInput
      })
    }
    updatePricing({
      ...pricing,
      priceRequestId: id,
      suggestedPrice,
      userPrice
    })
  } else {
    return {
      error: 'No response.'
    }
  }
}