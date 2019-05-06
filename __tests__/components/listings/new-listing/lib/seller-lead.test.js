import ApolloClient from 'apollo-client'
jest.mock('apollo-client')
jest.mock('lib/logging')
import {requestCreateTour, requestCreateSellerLead} from 'components/listings/new-listing/lib/seller-lead'

describe('seller create lead and tour functions', () => {
  it('should call the create tour request function', async () => {
    ApolloClient.mockImplementation(() => {
      return {
        mutate: () => {
          return {
            data: {tourSchedule: {id: 10}}
          }
        }
      }
    })
    const apolloClient = new ApolloClient()
    const params = {
      day: 10,
      time: 20,
      siteSellerLeadUuid: 'abcd-1234'
    }
    const result = await requestCreateTour(apolloClient, params)
    expect(result).toBe(true)
  })

  it('should call the create lead request function', async () => {
    ApolloClient.mockImplementation(() => {
      return {
        mutate: () => {
          return {
            data: {siteSellerLeadCreate: {uuid: '123'}}
          }
        }
      }
    })
    const apolloClient = new ApolloClient()
    const params = {
      location: {
        complement: 'apto 20'
      },
      homeDetails: {
        type: 'apartment',
        maintenanceFee: 200
      },
      rooms: {
        suites: 2,
      },
      pricing: {
        priceRequestId: 1,
        userPrice: 6000
      },
    }
    const result = await requestCreateSellerLead(apolloClient, params)
    expect(result).toBe('123')
  })
})
