import {getUser} from 'lib/user'

/**
 * Logs an event. Properties are optional. Do not log anything if
 * the user is an Admin.
 * @param event event name.
 * @param properties amplitude and gtm event properties
 */
export function log(event, properties) {
  // Skip log if admin
  const currentUser = getUser()
  if (isAdmin(currentUser)) {
    return
  }

  // Amplitude Log
  if (currentUser && currentUser.id) {
    amplitude.getInstance().setUserId(currentUser.id)
  }
  const path = window.location ? window.location.pathname : null
  amplitude.getInstance().logEvent(event, Object.assign(properties || {}, {path: path}))

  // Hotjar
  if (window.hj && HOTJAR_TAGS.includes(event)) {
    hj('tagRecording', [event])
    hj('trigger', event)
  }

  // Gtag
  let gtmEvent = GTM_EVENTS[event]
  if (gtmEvent) {
    if (event === LISTING_SEARCH_NEIGHBORHOOD_APPLY && (!properties || !properties.fromHome)) {
      return
    }
    const {getProps, ...dataLayerEvent} = gtmEvent
    window.dataLayer.push(
      getProps ? Object.assign(dataLayerEvent, getProps(properties), gtmEvent) : dataLayerEvent
    )
  }
}

/**
 * Creates an object containing listing info to be passed as Amplitude event property.
 * @param listing
 */
export function getListingInfoForLogs(listing) {
  const {id, address, area, bathrooms, floor, garageSpots, price, rooms, type, maintenanceFee, propertyTax, matterportCode} = listing
  return {
    listingId: id,
    address: address,
    neighborhood: address.neighborhoodSlug,
    city: address.citySlug,
    area,
    bathrooms,
    floor,
    garageSpots,
    price,
    rooms,
    type,
    maintenanceFee,
    propertyTax,
    hasTour: (matterportCode !== null).toString()
  }
}

/**
 * Returns a location object ready to be sent to Amplitude as an Event Property.
 * @param location
 */
export function normalizeLocation(location) {
  return {
    state: location.stateSlug,
    city: location.citySlug,
    neightborhood: location.name
  }
}

/**
 * Return true if user is admin.
 * @param currentUser
 */
function isAdmin(currentUser) {
  return currentUser && currentUser.admin
}

// Listing Search Events
export const LISTING_SEARCH_OPEN = 'listing-search-open'
export const LISTING_SEARCH_LOAD_MORE = 'listing-search-load-more'
export const LISTING_SEARCH_MAP_CLUSTER = 'listing-search-map-cluster'
export const LISTING_SEARCH_MAP_PIN = 'listing-search-map-pin'
export const LISTING_SEARCH_MAP_PAN = 'listing-search-map-pan'
export const LISTING_SEARCH_MAP_ZOOM = 'listing-search-map-zoom'
export const LISTING_SEARCH_FAVORITE_LISTING = 'listing-search-favorite-listing'
export const LISTING_SEARCH_FILTER_OPEN = 'listing-search-filter-open'
export const LISTING_SEARCH_FILTER_CLOSE = 'listing-search-filter-close'
export const LISTING_SEARCH_FILTER_APPLY = 'listing-search-filter-apply'
export const LISTING_SEARCH_FILTER_CLEAR = 'listing-search-filter-clear'
export const LISTING_SEARCH_FILTER_LOCATION = 'listing-search-filter-location'
export const LISTING_SEARCH_FILTER_TOGGLE = 'listing-search-filter-toggle'
export const LISTING_SEARCH_NOT_FOUND = 'listing-search-not-found'
export const LISTING_SEARCH_RESULTS = 'listing-search-results'

// Neighborhood Picker events
export const LISTING_SEARCH_NEIGHBORHOOD_OPEN = 'listing-search-neighborhood-open'
export const LISTING_SEARCH_NEIGHBORHOOD_APPLY = 'listing-search-neighborhood-apply'
export const LISTING_SEARCH_NEIGHBORHOOD_CLEAR = 'listing-search-neighborhood-clear'
export const LISTING_SEARCH_NEIGHBORHOOD_EXPAND = 'listing-search-neighborhood-expand'
export const LISTING_SEARCH_NEIGHBORHOOD_CHANGE_CITY = 'listing-search-neighborhood-change-city'
export const LISTING_SEARCH_NEIGHBORHOOD_SELECT_ALL = 'listing-search-neighborhood-select-all'

// Listing Details
export const LISTING_DETAIL_OPEN = 'listing-detail-open'
export const LISTING_DETAIL_PHOTOS_LEFT = 'listing-detail-photos-left'
export const LISTING_DETAIL_PHOTOS_RIGHT = 'listing-detail-photos-right'
export const LISTING_DETAIL_PHOTOS_FULLSCREEN_OPEN = 'listing-detail-photos-fullscreen-open'
export const LISTING_DETAIL_PHOTOS_FULLSCREEN_CLOSE = 'listing-detail-photos-fullscreen-close'
export const LISTING_DETAIL_MATTERPORT_OPEN = 'listing-detail-matterport-open'
export const LISTING_DETAIL_MATTERPORT_CLOSE = 'listing-detail-matterport-close'
export const LISTING_DETAIL_VIEW_FEATURED_LISTING = 'listing-detail-view-featured-listing'
export const LISTING_DETAIL_EXPAND_DESCRIPTION = 'listing-detail-expand-description'
export const LISTING_DETAIL_MAP_OPEN = 'listing-detail-map-open'
export const LISTING_DETAIL_MAP_CLOSE = 'listing-detail-map-close'
export const LISTING_DETAIL_STREETVIEW_OPEN = 'listing-detail-streetview-open'
export const LISTING_DETAIL_STREETVIEW_CLOSE = 'listing-detail-streetview-close'
export const LISTING_DETAIL_MORE_LISTINGS_BUTTON = 'listing-detail-more-listings-button'

// Buyer Listing Contact Form
export const LISTING_DETAIL_CONTACT_BUTTON = 'listing-detail-contact-button'
export const LISTING_DETAIL_OPEN_VISIT_FORM = 'listing-detail-open-visit-form'
export const LISTING_DETAIL_VISIT_FORM_ERROR = 'listing-detail-visit-form-error'
export const LISTING_DETAIL_CANCEL_VISIT_FORM = 'listing-detail-cancel-visit-form'
export const LISTING_DETAIL_CLOSE_VISIT_FORM = 'listing-detail-close-visit-form'
export const LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_BUTTON = 'listing-detail-visit-form-save-listing-button'
export const LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_LOGIN_CANCEL = 'listing-detail-visit-form-save-listing-login-cancel'
export const LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_LOGIN_SUCCESS = 'listing-detail-visit-form-save-listing-login-success'
export const LISTING_DETAIL_VISIT_FORM_SAVE_LISTING_SUCCESS = 'listing-detail-visit-form-save-listing-success'
export const LISTING_DETAIL_VISIT_FORM_NAME_INPUT = 'listing-detail-visit-form-name-input'
export const LISTING_DETAIL_VISIT_FORM_PHONE_INPUT = 'listing-detail-visit-form-phone-input'
export const LISTING_DETAIL_VISIT_FORM_VIEW_LISTINGS = 'listing-detail-visit-form-view-listings'
export const LISTING_DETAIL_SCHEDULE_VISIT = 'listing-detail-schedule-visit'

// Listing Save
export const LISTING_SAVE_LOGIN_OPEN = 'listing-save-login-open'
export const LISTING_SAVE_LOGIN_ACCOUNT_KIT = 'listing-save-login-account-kit'
export const LISTING_SAVE_LOGIN_SUCCESS = 'listing-save-login-success'
export const LISTING_SAVE_LOGIN_FAILED = 'listing-save-login-failed'
export const LISTING_SAVE_LOGIN_DONE = 'listing-save-login-done'
export const LISTING_SAVE_LOGIN_VIEW_FAVORITES = 'listing-save-login-view-favorites'
export const LISTING_SAVE_LOGIN_CLOSE = 'listing-save-login-close'

// Seller on-boarding
export function getSellerEventPrefix(evaluation, step) {
  if (['services', 'tour', 'success'].includes(step)) {
    return SELLER_ONBOARDING_EVENT_BASE
  }
  return evaluation ? SELLER_EVALUATION_EVENT_BASE : SELLER_ONBOARDING_EVENT_BASE
}
export const SELLER_ONBOARDING_EVENT_BASE = 'seller-onboarding-'
export const SELLER_EVALUATION_EVENT_BASE = 'seller-evaluation-'
export const SELLER_ONBOARDING_PRICING_SUCCESS = 'pricing-success'
export const SELLER_ONBOARDING_PRICING_FAILED = 'pricing-failed'
export const SELLER_ONBOARDING_SERVICES_SCHEDULE = 'seller-onboarding-services-schedule'
export const SELLER_ONBOARDING_SERVICES_SKIP = 'seller-onboarding-services-skip'
export const SELLER_ONBOARDING_EDIT_PRICE = 'edit-price'
export const SELLER_ONBOARDING_EDIT_PRICE_CANCEL = 'edit-price-cancel'
export const SELLER_ONBOARDING_EDIT_PRICE_CONFIRM = 'edit-price-confirm'
export const SELLER_ONBOARDING_PHONE_LOGIN_START = 'phone-login-start'
export const SELLER_ONBOARDING_PHONE_LOGIN_SUCCESS = 'phone-login-success'
export const SELLER_ONBOARDING_PHONE_LOGIN_CANCEL = 'phone-login-cancel'
export const SELLER_ONBOARDING_PHONE_UPDATE_USER_NAME = 'phone-update-user-name'
export const SELLER_ONBOARDING_LISTING_CREATION_SUCCESS = 'seller-onboarding-listing-creation-success'
export const SELLER_ONBOARDING_LISTING_CREATION_ERROR = 'seller-onboarding-listing-creation-error'
export const SELLER_ONBOARDING_TOUR_CREATION_SUCCESS = 'seller-onboarding-tour-creation-success'
export const SELLER_ONBOARDING_TOUR_CREATION_ERROR = 'seller-onboarding-tour-creation-error'
export const SELLER_EVALUATION_SUCCESS = 'seller-evaluation-success'

// Home events
export const BUYER_LANDING_PAGE = 'buyer-landing-page'
export const BUYER_LANDING_EXPLORE_LISTINGS = 'buyer-landing-explore-listings'
export const BUYER_LANDING_NEIGHBORHOOD_IMAGE = 'buyer-landing-neighborhood-image'
export const BUYER_LANDING_NEIGHBORHOOD_LINK = 'buyer-landing-neighborhood-link'
export const BUYER_LANDING_SCROLL_25 = 'buyer-landing-scroll-25'
export const BUYER_LANDING_SCROLL_50 = 'buyer-landing-scroll-50'
export const BUYER_LANDING_SCROLL_75 = 'buyer-landing-scroll-75'
export const BUYER_LANDING_SCROLL_100 = 'buyer-landing-scroll-100'
export const SELLER_LANDING_PAGE = 'seller-landing-page'
export const SELLER_LANDING_SCROLL_25 = 'seller-landing-scroll-25'
export const SELLER_LANDING_SCROLL_50 = 'seller-landing-scroll-50'
export const SELLER_LANDING_SCROLL_75 = 'seller-landing-scroll-75'
export const SELLER_LANDING_SCROLL_100 = 'seller-landing-scroll-100'
export const SELLER_LANDING_EXPLORE_LISTINGS = 'seller-landing-explore-listings'

// Login actions
export const LANDING_LOGIN = 'landing-login'
export const LOGIN_SUCCESS = 'login-success'
export const LOGIN_ERROR = 'login-error'
export const SIGNUP_SUCCESS = 'signup-success'

// Profile Pages
export const PROFILE_OPEN = 'profile-open'
export const PROFILE_MY_PROFILE = 'profile-my-profile'
export const PROFILE_FAVORITES = 'profile-favorites'
export const PROFILE_LOGOUT = 'profile-logout'
export const PROFILE_EDIT = 'profile-edit'
export const PROFILE_EDIT_CANCEL = 'profile-edit-cancel'
export const PROFILE_EDIT_SAVE = 'profile-edit-save'
export const PROFILE_FAVORITES_EXPLORE_LISTINGS = 'profile-favorites-explore-listings'

// Data Layer
const GTM_EVENTS = {
  [BUYER_LANDING_PAGE]: {
    action: 'Buyer Landing Page',
    event: 'buyer_landing_page',
    getProps: (props) => {
      const properties = props || {}

      return Object.assign(properties, {
        listing_pagetype: 'home'
      })
    }
  },
  [LISTING_SEARCH_NEIGHBORHOOD_APPLY]: {
    action: 'User Search Home Page',
    event: 'search_home',
    getProps: (props) => props
  },
  [`${SELLER_ONBOARDING_EVENT_BASE}addressInput`]: {
    action: 'Seller Onboarding addressInput',
    event: 'seller_onboarding_addressinput',
    getProps: (props) => props
  },
  [`${SELLER_ONBOARDING_EVENT_BASE}pricing`]: {
    action: 'Seller Onboarding pricing',
    event: 'seller_onboarding_pricing',
    getProps: (props) => props
  },
  [`${SELLER_ONBOARDING_EVENT_BASE}success`]: {
    action: 'Seller Onboarding Success',
    event: 'seller_onboarding_success',
    getProps: (props) => props
  },
  [`${SELLER_ONBOARDING_EVENT_BASE}notifyCoverage`]: {
    action: 'Seller Onboarding NotifyCoverage',
    event: 'seller_onboarding_notifyCoverage',
    getProps: (props) => props
  },
  [`${SELLER_EVALUATION_EVENT_BASE}pricing`]: {
    action: 'Seller Evaluation pricing',
    event: 'seller_evaluation_pricing',
    getProps: (props) => props
  },
  [`${SELLER_EVALUATION_EVENT_BASE}success`]: {
    action: 'Seller Evaluation Success',
    event: 'seller_evaluation_success',
    getProps: (props) => props
  },
  [LISTING_DETAIL_OPEN]: {
    action: 'Open Listing',
    event: 'listing_detail_open',
    getProps: (props) => {
      return Object.assign(props, {
        listing_pagetype: 'offerdetail'
      })
    }
  },
  [LISTING_DETAIL_MATTERPORT_OPEN]: {
    action: 'Open Matterport',
    event: 'listing_detail_matterport_open',
    getProps: (props) => props
  },
  [LISTING_DETAIL_OPEN_VISIT_FORM]: {
    action: 'Open Visit Form',
    event: 'listing_detail_open_visit_form',
    getProps: (props) => {
      return Object.assign(props, {
        listing_pagetype: 'conversionintent'
      })
    }
  },
  [LISTING_DETAIL_SCHEDULE_VISIT]: {
    action: 'Schedule Visit',
    event: 'listing_detail_schedule_visit',
    getProps: (props) => {
      return Object.assign(props, {
        listing_pagetype: 'conversion'
      })
    }
  },
  [LISTING_DETAIL_MORE_LISTINGS_BUTTON]: {
    action: 'More Listings Button',
    event: 'listing_detail_more_listings_button',
    getProps: (props) => props
  },
  [LISTING_SEARCH_RESULTS]: {
    action: 'Listing Search Results',
    event: 'listing_search_results',
    getProps: (props) => {
      const content_ids = []
      const neighborhood = []
      const city = []
      const region = []

      props.listings.map(content => {
        content_ids.push(content.id)
        if (neighborhood.indexOf(content.address.neighborhood) === -1) {
           neighborhood.push(content.address.neighborhood)
        }
        if (city.indexOf(content.address.city) === -1) {
           city.push(content.address.city)
        }

        if (region.indexOf(content.address.state) === -1) {
           region.push(content.address.state)
        }
      })

      return Object.assign(props, {
        content_ids: content_ids,
        listing_pagetype: 'searchresults',
        neighborhood: neighborhood.toString(),
        city: city.toString(),
        region: region.toString()
      })
    }
  }
}

// Hotjar tags
const HOTJAR_TAGS = [
  BUYER_LANDING_PAGE,
  SELLER_LANDING_PAGE,
  LISTING_DETAIL_OPEN,
  LISTING_DETAIL_OPEN_VISIT_FORM,
  LISTING_DETAIL_SCHEDULE_VISIT,
  [`${SELLER_ONBOARDING_EVENT_BASE}addressInput`],
  [`${SELLER_EVALUATION_EVENT_BASE}addressInput`],
  LISTING_DETAIL_PHOTOS_FULLSCREEN_OPEN,
  LISTING_DETAIL_MATTERPORT_OPEN,
  LISTING_SEARCH_FAVORITE_LISTING
]
