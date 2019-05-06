import gql from 'graphql-tag'

export const FAVORITE_LISTING = gql`
  mutation favoriteListing($id: ID!) {
    favoriteListing(id: $id) {
      listing {
        id
      }
    }
  }
`

export const UNFAVORITE_LISTING = gql`
  mutation unfavoriteListing($id: ID!) {
    unfavoriteListing(id: $id) {
      listing {
        id
      }
    }
  }
`

export const VISUALIZE_TOUR = gql`
  mutation tourVisualized($id: ID!) {
    tourVisualized(id: $id) {
      id
    }
  }
`

export const ACTIVATE_LISTING = gql`
  mutation activateListing($id: ID!) {
    activateListing(id: $id) {
      id
    }
  }
`

export const DEACTIVATE_LISTING = gql`
  mutation deactivateListing($id: ID!) {
    deactivateListing(id: $id) {
      id
    }
  }
`

export const ADDRESS_INSERT = gql`
  mutation addressInsert(
    $input: AddressInput!
  ) {
    addressInsert(
      input: $input
    ) {
      isCovered
    }
  }
`

export const ESTIMATE_PRICE = gql`
  mutation requestPriceSuggestion(
    $address: AddressInput!
    $area: Int!
    $bathrooms: Int!
    $email: String
    $garageSpots: Int!
    $name: String
    $rooms: Int!
    $isCovered: Boolean!
  ) {
    requestPriceSuggestion(
      address: $address
      area: $area
      bathrooms: $bathrooms
      email: $email
      garageSpots: $garageSpots
      name: $name
      rooms: $rooms
      isCovered: $isCovered
    ) {
      id
      suggestedPrice
    }
  }
`

export const NOTIFY_WHEN_COVERED = gql`
  mutation notifyWhenCovered($city: String!, $email: String, $message: String, $name: String, $neighborhood: String!, $phone: String, $state: String!) {
    notifyWhenCovered(city: $city, email: $email, message: $message, name: $name, neighborhood: $neighborhood, phone: $phone, state: $state) {
      id
    }
  }
`

export const INSERT_LISTING = gql`
  mutation insertListing($input: ListingInput!) {
    insertListing(input: $input) {
      id
    }
  }
`

export const TOUR_SCHEDULE = gql`
  mutation tourSchedule($input: TourScheduleInput!) {
    tourSchedule(input: $input) {
      id
    }
  }
`

export const CREATE_LEAD = gql`
  mutation SiteSellerLeadCreate ($input: SiteSellerLeadInput!) {
    siteSellerLeadCreate(input: $input) {
      uuid
    }
  }
`
