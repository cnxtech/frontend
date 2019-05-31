const BUY_TITLE_BASE = 'Apartamentos e Casas à venda'
const BUY_TITLE_APARTAMENT = 'Apartamentos à venda'
const BUY_TITLE_HOUSE = 'Casas à venda'
const BUY_TITLE_PENTHOUSE = `Coberturas à venda`
const BUY_TITLE_DEFAULT_END = 'na Zona Sul do Rio de Janeiro e em São Paulo.'
const BUY_TITLE_FILTER_PREPOSITION = 'em'
const BUY_TITLE_NEIGHBORHOOD_PREPOSITION = 'em'
const BUY_TITLE_CITY_PREPOSITION = 'em'
const BUY_TITLE_STATE_PREPOSITION = 'no'
const CUSTOM_BUY_TITLE = [
  {
    citySlug: 'rio-de-janeiro',
    value: 'na Zona Sul do Rio de Janeiro'
  },
  {
    stateSlug: 'sp',
    value: 'em São Paulo'
  }
]

const BUY_TITLE_BY_TYPE = {
  ['Apartamento']: BUY_TITLE_APARTAMENT,
  ['Casa']: BUY_TITLE_HOUSE,
  ['Cobertura']: BUY_TITLE_PENTHOUSE
}

const TYPES_PLURAL = {
  ['Apartamento']: 'Apartamentos',
  ['Casa']: 'Casas',
  ['Cobertura']: 'Coberturas'
}

export {
  BUY_TITLE_BASE,
  BUY_TITLE_DEFAULT_END,
  BUY_TITLE_FILTER_PREPOSITION,
  BUY_TITLE_NEIGHBORHOOD_PREPOSITION,
  BUY_TITLE_CITY_PREPOSITION,
  BUY_TITLE_STATE_PREPOSITION,
  BUY_TITLE_BY_TYPE,
  TYPES_PLURAL,
  CUSTOM_BUY_TITLE
}
