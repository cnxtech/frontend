import {
  NAVIGATE,
  UPDATE_LOCATION,
  UPDATE_HOME_DETAILS,
  UPDATE_ROOMS,
} from './actions'

const initialState = {
  step: 'intro',
  location: {
    address: null,
    complement: null
  },
  homeDetails: {
    homeType: null,
    floor: null,
    area: null,
    cond: null,
    iptu: null
  },
  rooms: {
    bedrooms: null,
    suites: null,
    bathrooms: null,
    enterMoreBedrooms: false,
    enterMoreBathrooms: false
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NAVIGATE:
      return {
        ...state,
        step: action.step
      }
    case UPDATE_LOCATION:
      return {
        ...state,
        location: action.value
      }
    case UPDATE_HOME_DETAILS:
      return {
        ...state,
        homeDetails: action.value
      }
    case UPDATE_ROOMS:
      return {
        ...state,
        rooms: action.value
      }
    default:
      return state
  }
}

export default reducer
