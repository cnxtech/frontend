import {getSellerLeadInput} from 'lib/listings/insert'

describe('seller lead creation functions insert functions', () => {
  it('should create the correct input for the seller lead mutation', () => {
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
        priceRequestId: 123,
        userPrice: 6000
      },
    }

    const sellerLeadInput = getSellerLeadInput(params)
    const {complement, priceRequestId, maintenanceFee, price, suites, type} = sellerLeadInput

    expect(complement).toBe('apto 20')
    expect(maintenanceFee).toBe(200)
    expect(price).toBe(6000)
    expect(suites).toBe(2)
    expect(priceRequestId).toBe(123)
    expect(type).toBe('apartment')
  })
})
