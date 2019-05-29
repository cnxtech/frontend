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
  getTitleTextByParams
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
    const params = []
    const title = getTitleTextByParams(params, DISTRICTS)
    expect(title).toBe(`${BUY_TITLE_BASE} ${BUY_TITLE_DEFAULT_END}`)
  })

  it('returns the state title', () => {
    const params = {
      state: 'rj'
    }
    const title = getTitleTextByParams(params, DISTRICTS)
    const {state} = DISTRICTS.find(value => value.stateSlug === params.state)
    expect(title).toBe(`${BUY_TITLE_BASE} ${BUY_TITLE_STATE_PREPOSITION} ${state}`)
  })

  it('returns the city title', () => {
    const params = {
      state: 'sp',
      city: 'sao-paulo'
    }
    const title = getTitleTextByParams(params, DISTRICTS)
    const {state, city} = DISTRICTS.find(value => value.citySlug === params.city)
    expect(title).toBe(`${BUY_TITLE_BASE} ${BUY_TITLE_CITY_PREPOSITION} ${city} - ${state}`)
  })

  it('returns the neighbourhood title', () => {
    const params = {
      state: "rj",
      city: "rio-de-janeiro",
      neighborhood: "copacabana"
    }
    const title = getTitleTextByParams(params, DISTRICTS)
    const {state, city, name} = DISTRICTS.find(value => value.nameSlug === params.neighborhood)
    expect(title).toBe(`${BUY_TITLE_BASE} ${BUY_TITLE_NEIGHBORHOOD_PREPOSITION} ${name}, ${city} - ${state}`)
  })

  it('returns the custom state title', () => {
    const params = {
      state: 'sp'
    }
    const title = getTitleTextByParams(params, DISTRICTS)
    const custom = CUSTOM_BUY_TITLE.find(a => a.stateSlug === params.state)
    expect(title).toBe(`${BUY_TITLE_BASE} ${custom.value}`)
  })

  it('returns the custom city title', () => {
    const params = {
      state: 'sp',
      city: 'rio-de-janeiro'
    }
    const title = getTitleTextByParams(params, DISTRICTS)
    const custom = CUSTOM_BUY_TITLE.find(a => a.citySlug === params.city)
    expect(title).toBe(`${BUY_TITLE_BASE} ${custom.value}`)
  })
})
