import {captureException} from '@sentry/browser'
import moment from 'moment'
import {CREATE_LEAD, TOUR_SCHEDULE} from 'graphql/listings/mutations'
import {getSellerLeadInput} from 'lib/listings/insert'
import {
  log,
  SELLER_ONBOARDING_LISTING_CREATION_SUCCESS,
  SELLER_ONBOARDING_LISTING_CREATION_ERROR,
  SELLER_ONBOARDING_TOUR_CREATION_SUCCESS,
  SELLER_ONBOARDING_TOUR_CREATION_ERROR
} from 'lib/logging'

/**
 * Calls the mutation to create a tour. Returns true if success, false otherwise.
 */
export const requestCreateTour = async (apolloClient, {day, time, uuid}) => {
  const datetime = moment(day + time, 'YYYY-MM-DD HH').toDate()
  try {
    const { data } = await apolloClient.mutate({
      mutation: TOUR_SCHEDULE,
      variables: {
        input: {
          siteSellerLeadUuid: uuid,
          options: {
            datetime
          },
          wantsTour: true,
          wantsPictures: true
        }
      }
    })

    if (data) {
      log(SELLER_ONBOARDING_TOUR_CREATION_SUCCESS, {
        uuid: uuid,
        options: datetime
      })
      return true
    }
  } catch (e) {
    captureException(e)
    log(SELLER_ONBOARDING_TOUR_CREATION_ERROR, {
      uuid: uuid,
      options: datetime,
      error: e && e.message ? e.message : ''
    })
  }
  return false
}

/**
 * Calls the mutation to create a seller lead. Returns the lead uuid if success,
 * null otherwise.
 */
export const requestCreateLead = async (apolloClient, listingData) => {
  const input = getSellerLeadInput(listingData)
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_LEAD,
      variables: {
        input
      }
    })

    if (data) {
      log(SELLER_ONBOARDING_LISTING_CREATION_SUCCESS, {listing: input})
      return data.siteSellerLeadCreate.uuid
    }
  } catch (e) {
    captureException(e)
    log(SELLER_ONBOARDING_LISTING_CREATION_ERROR, {
      listing: input,
      error: e && e.message ? e.message : ''
    })
  }
  return null
}
