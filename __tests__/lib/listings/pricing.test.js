import ApolloClient from 'apollo-client'
jest.mock('apollo-client')
import { estimatePrice, getPricingInput } from 'lib/listings/pricing'

describe('pricing functions', () => {
  it('should create the correct input for the pricing query', () => {
    const addressInput = {}
    const homeDetails = {area: 100}
    const homeRooms = {bathrooms: 2, bedrooms: 3, spots: 1}
    const phone = {name: 'name'}

    const pricingInput = getPricingInput(addressInput, homeDetails, homeRooms, phone)
    const { address, area, bathrooms, rooms, name, garageSpots, isCovered } = pricingInput

    expect(address).toEqual({})
    expect(area).toBe(100)
    expect(bathrooms).toBe(2)
    expect(rooms).toBe(3)
    expect(garageSpots).toBe(1)
    expect(name).toBe('name')
    expect(isCovered).toBe(true)
  })

  it('should create the correct input for the pricing query', () => {
    const addressInput = {}
    const homeDetails = {area: 100}
    const homeRooms = {bathrooms: 2, bedrooms: 3, spots: 1}
    const phone = {name: null}
    const userInfo = {name: 'test'}

    const pricingInput = getPricingInput(addressInput, homeDetails, homeRooms, phone, userInfo)
    const { address, area, bathrooms, rooms, name, garageSpots, isCovered } = pricingInput

    expect(address).toEqual({})
    expect(area).toBe(100)
    expect(bathrooms).toBe(2)
    expect(rooms).toBe(3)
    expect(garageSpots).toBe(1)
    expect(name).toBe('test')
    expect(isCovered).toBe(true)
  })

  it('should calculate pricing', async () => {
    ApolloClient.mockImplementation(() => {
      return {
        mutate: () => {
          return {
            data: {requestPriceSuggestion: {id: 123, suggestedPrice: 1000000}}
          }
        }
      }
    })
    const apolloClient = new ApolloClient()
    const { result, error } = await estimatePrice(apolloClient, {})
    expect(result.suggestedPrice).toBe(1000000)
    expect(result.id).toBe(123)
    expect(error).toEqual(null)
  })

  it('should fail to calculate pricing', async () => {
    ApolloClient.mockImplementation(() => {
      return {
        mutate: () => {throw Error()}
      }
    })
    const apolloClient = new ApolloClient()
    const { result, error } = await estimatePrice(apolloClient, {})
    expect(result).toEqual(null)
    expect(error).toBe('Ocorreu um erro. Por favor, tente novamente.')
  })
})
