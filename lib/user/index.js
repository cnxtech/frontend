import * as Sentry from '@sentry/browser'
import get from 'lodash/get'
import {GET_USER_INFO} from 'graphql/user/queries'

export const getUserInfo = async (id) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_INFO,
      variables: {
        id
      }
    })
    return data.userProfile
  } catch(e) {
    Sentry.captureException(e)
    return {
      result: null,
      error: 'Ocorreu um erro. Por favor, tente novamente.'
    }
  }
}

/**
 * Returns the user that is currently logged in or null if there is none.
 * Returns null on server.
 */
export const getUser = () => {
  if (process.browser && window) {
    // User object that gets updated as soon as the user logs in, but before the page reloads
    const pageUser = get(window, '__NEXT_DATA__.props.initialProps.pageProps.currentUser')
    if (pageUser) {
      return pageUser
    }
    return get(window, '__NEXT_DATA__.props.initialProps.currentUser')
  }
  return null
}

/**
 * Returns an object with each part of the phone number: local area code and number. Cuts out international code, if present.
 *
 * @param {string} phone full phone string.
 */
export const getPhoneParts = (phone) => {
  // Accounting for international code data
  if (phone.startsWith('+55')) {
    phone = phone.replace('+55', '')
  } else if (phone.startsWith('55') && (phone.length === 13 || phone.length === 12)) {
    phone = phone.replace('55', '')
  }
  phone = phone.replace('undefined', '')
  const localAreaCode = phone.substr(0, 2)
  const number = phone.substr(2, phone.length - 1)
  return {
    localAreaCode,
    number
  }
}

/**
 * Returns a formatted phone number string to be displayed.
 *
 * @param {object} phone phone number object, with localAreaCode and number.
 */
export const getPhoneDisplay = ({localAreaCode, number}) => {
  return `(${localAreaCode}) ${number}`
}
