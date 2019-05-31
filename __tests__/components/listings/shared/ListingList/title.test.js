import {
  BUY_TITLE_BASE,
  BUY_TITLE_DEFAULT_END,
  BUY_TITLE_FILTER_PREPOSITION,
  BUY_TITLE_NEIGHBORHOOD_PREPOSITION,
  BUY_TITLE_CITY_PREPOSITION,
  BUY_TITLE_STATE_PREPOSITION,
  CUSTOM_BUY_TITLE
} from 'constants/listing-locations'

import {
  getTitleTextByFilters
} from 'components/listings/shared/ListingList/title'

const DISTRICTS = [
  {
    stateSlug: 'rj',
    citySlug: 'rio-de-janeiro',
    nameSlug: 'copacabana',
    state: 'RJ',
    city: 'Rio de Janeiro',
    name: 'Copacabana'
  },
  {
    stateSlug: 'rj',
    citySlug: 'rio-de-janeiro',
    nameSlug: 'ipanema',
    state: 'RJ',
    city: 'Rio de Janeiro',
    name: 'Ipanema'
  },
  {
    stateSlug: 'sp',
    citySlug: 'sao-paulo',
    nameSlug: 'perdizes',
    state: 'SP',
    city: 'São Paulo',
    name: 'Perdizes'
  },
  {
    stateSlug: 'sp',
    citySlug: 'sao-paulo',
    nameSlug: 'pompeia',
    state: 'SP',
    city: 'São Paulo',
    name: 'Pompéia'
  }
]

describe('Listing page title', () => {
  it('returns the base title', () => {
    const filters = {}
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} ${BUY_TITLE_DEFAULT_END}`)
  })

  it('returns title containing city name', () => {
    const filters = {
      citiesSlug: ['rio-de-janeiro']
    }
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} ${CUSTOM_BUY_TITLE[0].value}`)
  })

  it('returns title containing tags', () => {
    const filters = {
      tagsSlug: ['academia', 'bicicletario']
    }
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} com Academia, Bicicletario ${BUY_TITLE_DEFAULT_END}`)
  })

  it('returns title containing min price', () => {
    const filters = {
      minPrice: 300000
    }
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} a partir de R$300,000 ${BUY_TITLE_DEFAULT_END}`)
  })

  it('returns title containing max price', () => {
    const filters = {
      maxPrice: 300000
    }
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} até R$300,000 ${BUY_TITLE_DEFAULT_END}`)
  })

  it('returns title containing min and max price', () => {
    const filters = {
      minPrice: 100000,
      maxPrice: 300000
    }
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} de R$100,000 a R$300,000 ${BUY_TITLE_DEFAULT_END}`)
  })

  it('returns title containing min price when max === min', () => {
    const filters = {
      minPrice: 100000,
      maxPrice: 100000
    }
    const title = getTitleTextByFilters(filters, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} R$100,000 ${BUY_TITLE_DEFAULT_END}`)
  })
})
