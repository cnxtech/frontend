import {
  treatParams,
  getNewFiltersFromQuery,
  getListingFiltersFromState,
  getLocationFromPath,
  addNeighborhoodsToQuery
} from 'utils/filter-params'

describe('listing search filter functions', () => {
  it('parses query and params filters to filter state', () => {
    const query = {
      preco_minimo: 250000,
      preco_maximo: 1500000,
      area_minima: 35,
      area_maxima: 300,
      vagas_minimo: 2,
      vagas_maximo: 2,
      quartos_minimo: 3,
      quartos_maximo: 3,
      bairros: 'botafogo|ipanema',
      tipos: 'Apartamento|Casa'
    }
    const params = {
      state: 'rj',
      city: 'rio-de-janeiro',
      neighborhood: 'humaita'
    }
    const filters = getNewFiltersFromQuery(query, params)
    expect(filters).toEqual({
      area: {max: 300, min: 35},
      citySlug: 'rio-de-janeiro',
      garageSpots: {max: 2, min: 2},
      neighborhoods: ['botafogo', 'ipanema'],
      neighborhoodsSlugs: ['humaita'],
      price: {max: 1500000, min: 250000},
      rooms: {max: 3, min: 3},
      types: ['Apartamento', 'Casa']
    })
  })

  it('parses query with only one home type to filter state', () => {
    const query = {
      tipos: 'Apartamento'
    }
    const filters = getNewFiltersFromQuery(query)
    expect(filters).toEqual({types: ['Apartamento']})
  })

  it('parses user selected filters into query string', () => {
    const filters = {
      price: {
        min: 250000,
        max: 2500000
      },
      area: {
        min: 35,
        max: 150
      },
      garageSpots: {
        min: 2
      },
      rooms: {
        min: 3
      },
      neighborhoods: ['botafogo'],
      citySlug: 'rio-de-janeiro',
      types: ['Apartamento', 'Cobertura']
    }
    const query = getListingFiltersFromState(filters)
    expect(query).toEqual({
      maxArea: 150,
      minGarageSpots: 2,
      maxPrice: 2500000,
      minRooms: 3,
      minArea: 35,
      minPrice: 250000,
      neighborhoodsSlugs: ['botafogo'],
      types: ['Apartamento', 'Cobertura'],
      citiesSlug: ['rio-de-janeiro']
    })
  })

  it('parses user selected garage spots into query string', () => {
    const filters = {
      garageSpots: {
        min: 0,
        max: 0
      }
    }
    const query = getListingFiltersFromState(filters)
    expect(query).toEqual({minGarageSpots: 0, maxGarageSpots: 0})
  })

  it('returns an empty filter object when no filter state is passed', () => {
    const filterState = null
    const filters = getListingFiltersFromState(filterState)
    expect(filters).toEqual({})
  })

  it('returns an empty filter object when an empty filter state is passed', () => {
    const filterState = {}
    const filters = getListingFiltersFromState(filterState)
    expect(filters).toEqual({})
  })

  it('parses url with location into a location object', () => {
    const asPath = '/imoveis/rj/rio-de-janeiro/humaita/apartamento'
    const location = getLocationFromPath(asPath)
    expect(location).toEqual({
      citySlug: 'rio-de-janeiro',
      stateSlug: 'rj',
      filters: {
        citySlug: 'rio-de-janeiro',
        stateSlug: 'rj',
        types: ['Apartamento'],
        neighborhoods: ['humaita']
      }
    })
  })

  it('parses url with incomplete location into a location object', () => {
    const asPath = '/imoveis/rj/rio-de-janeiro/apartamento'
    const location = getLocationFromPath(asPath)
    expect(location).toEqual({
      citySlug: 'rio-de-janeiro',
      stateSlug: 'rj',
      filters: {
        citySlug: 'rio-de-janeiro',
        stateSlug: 'rj',
        types: ['Apartamento']
      }
    })
  })

  it('reads filters from a given object and parses into a query string', () => {
    const filters = {
      price: {
        min: 250000,
        max: 500000
      },
      area: {
        min: 50,
        max: 150
      },
      rooms: {
        min: 2,
        max: 4
      },
      garageSpots: {
        min: 2,
        max: 4
      },
      neighborhoods: {
        min: 1,
        max: 3
      },
      types: ['Apartamento', 'Cobertura']
    }
    const queryString = treatParams(filters)
    expect(queryString).toBe(
      'preco_minimo=250000&preco_maximo=500000&area_minima=50&area_maxima=150&quartos_minimo=2&quartos_maximo=4&vagas_minimo=2&vagas_maximo=4&tipos=Apartamento|Cobertura'
    )
  })

  it('adds neighborhoods to filters', () => {
    const filters = {}
    const selectedNeighborhoods = ['ipanema', 'copacabana']
    const query = addNeighborhoodsToQuery(filters, selectedNeighborhoods)
    expect(query).toBe('?bairros=ipanema|copacabana')
  })

  it('adds neighborhoods to existing filters', () => {
    const filters = {rooms: {min: 2}}
    const selectedNeighborhoods = ['ipanema', 'copacabana']
    const query = addNeighborhoodsToQuery(filters, selectedNeighborhoods)
    expect(query).toBe('?quartos_minimo=2&bairros=ipanema|copacabana')
  })

  it('adds neighborhoods to filters when there are two or more filters', () => {
    const filters = {rooms: {min: 2}, types: ['Apartamento', 'Casa']}
    const selectedNeighborhoods = ['ipanema', 'copacabana']
    const query = addNeighborhoodsToQuery(filters, selectedNeighborhoods)
    expect(query).toBe(
      '?quartos_minimo=2&bairros=ipanema|copacabana&tipos=Apartamento|Casa'
    )
  })

  it('adds neighborhoods to filters when theres already a neighborhood selected', () => {
    const filters = {neighborhoods: ['botafogo']}
    const selectedNeighborhoods = ['ipanema', 'copacabana']
    const query = addNeighborhoodsToQuery(filters, selectedNeighborhoods)
    expect(query).toBe('?bairros=ipanema|copacabana')
  })

  it('adds neighborhoods to filters when theres already a neighborhood selected, among other filters', () => {
    const filters = {
      rooms: {min: 2},
      types: ['Apartamento', 'Casa'],
      neighborhoods: ['botafogo', 'leblon']
    }
    const selectedNeighborhoods = ['ipanema', 'copacabana']
    const query = addNeighborhoodsToQuery(filters, selectedNeighborhoods)
    expect(query).toBe(
      '?quartos_minimo=2&bairros=ipanema|copacabana&tipos=Apartamento|Casa'
    )
  })
})
