import {post, get} from 'lib/request'
import {addInternationalCode, clearPhoneString} from 'utils/text-utils'

const buildPayload = (data) => {
  return {
    interest: {
      name: data.name,
      email: data.email,
      phone: addInternationalCode(clearPhoneString(data.phone)),
      message: data.message,
      interest_type_id: data.interest_type_id
    }
  }
}

export const createInterest = async (listingId, data) => {
  const payload = buildPayload(data)
  try {
    return await post(`/listings/${listingId}/interests`, payload)
  } catch (error) {
    return error.response && error.response.status === 422
      ? error.response
      : 'Unknown error. Please try again.'
  }
}

export const getInterestTypes = async () => {
  try {
    return await get('/interest_types')
  } catch (error) {
    return error.response && error.response.status === 422
      ? error.response
      : 'Unknown error. Please try again.'
  }
}
