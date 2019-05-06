import ApolloClient from 'apollo-client'
jest.mock('apollo-client')
jest.mock('lib/logging')
import {requestPricing} from 'components/listings/new-listing/lib/pricing'

describe('seller pricing step functions', () => {
  it('should call the price request function', async () => {
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
    const userInfo = {id: 1, phone: '1122223333'}
    const addressData = JSON.parse('{"address_components":[{"long_name":"600","short_name":"600","types":["street_number"]},{"long_name":"Avenida Vieira Souto","short_name":"Av. Vieira Souto","types":["route"]},{"long_name":"Ipanema","short_name":"Ipanema","types":["sublocality_level_1","sublocality","political"]},{"long_name":"Rio de Janeiro","short_name":"Rio de Janeiro","types":["administrative_area_level_2","political"]},{"long_name":"Rio de Janeiro","short_name":"RJ","types":["administrative_area_level_1","political"]},{"long_name":"Brasil","short_name":"BR","types":["country","political"]},{"long_name":"22410-050","short_name":"22410-050","types":["postal_code"]}],"formatted_address":"Av. Vieira Souto, 600 - Ipanema, Rio de Janeiro - RJ, 22410-050, Brasil","geometry":{"location":{"lat":-22.9858683,"lng":-43.21129699999999},"viewport":{"northeast":{"lat":-22.9846424197085,"lng":-43.2099553197085},"southwest":{"lat":-22.9873403802915,"lng":-43.2126532802915}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png","id":"c4f62c1516b85f7a5772aa418e269643a8f4810f","name":"Av. Vieira Souto, 600","place_id":"ChIJvbT8NhrVmwARKefbr8KU8oY","plus_code":{"compound_code":"2Q7Q+MF Rio de Janeiro, RJ, Brasil","global_code":"589R2Q7Q+MF"},"reference":"ChIJvbT8NhrVmwARKefbr8KU8oY","scope":"GOOGLE","types":["street_address"],"url":"https://maps.google.com/?q=Av.+Vieira+Souto,+600+-+Ipanema,+Rio+de+Janeiro+-+RJ,+22410-050,+Brasil&ftid=0x9bd51a36fcb4bd:0x86f294c2afdbe729","utc_offset":-120,"vicinity":"Ipanema"}')
    const props = {
      homeDetails: {
        area: 123,
        maintenanceFee: 123,
        type: "Apartamento"
      },
      location: {
        address: 'Av. Vieira Souto, 500',
        addressData
      },
      phone: {
        localAreaCode: "11",
        name: "Tulio",
        number: "22223333"
      },
      rooms: {
        bathrooms: 3,
        bedrooms: 4,
        spots: 2,
        suites: 2
      },
      evaluation: null,
      updatePricing: jest.fn()
    }
    await requestPricing(apolloClient, userInfo, props)
    expect(props.updatePricing).toHaveBeenCalled()
  })
})
