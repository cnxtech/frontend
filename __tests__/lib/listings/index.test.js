import {
  getListingId,
  getListingSummary,
  plural,
  buildSlug
} from 'lib/listings'

describe('Listing', () => {
  it('should read the correct listing id from url', () => {
    const url = 'https://emcasa.com/imoveis/rj/rio-de-janeiro/copacabana/rua-5-de-julho/id-840'
    const id = getListingId(url)
    expect(id).toBe('840')
  })

  it('should read the correct listing id from legacy url', () => {
    const url = 'https://emcasa.com/imoveis/840'
    const id = getListingId(url)
    expect(id).toBe('840')
  })

  it('should not raise exception when no id is passed', () => {
    const url = '/imoveis/bairros/sumare'
    const id = getListingId(url)
    expect(id).toBe(null)
  })

  it('should return the correct plural given a number', () => {
    let item = 0
    expect(plural(item)).toBe('s')
    item = 1
    expect(plural(item)).toBe('')
    item = 2
    expect(plural(item)).toBe('s')
  })

  it('should return a string with the listing summary', () => {
    const listing = {
      area: 500,
      bathrooms: 3,
      garageSpots: 2,
      rooms: 4
    }
    const listingSummary = getListingSummary(listing, ' - ')
    expect(listingSummary).toBe('500m² - 4 quartos - 2 vagas')
  })

  it('should build slug based on listing data', () => {
    const listing = {
      id: 123,
      address: {
        city: 'rio',
        state: 'rj',
        neighborhood: 'ipanema',
        street: 'rua'
      }
    }
    const result = buildSlug(listing)
    expect(result).toBe('/imoveis/rj/rio/ipanema/rua/id-123')
  })
})

