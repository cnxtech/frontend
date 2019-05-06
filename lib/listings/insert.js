export function getSellerLeadInput({location, homeDetails, rooms, pricing}) {
  const {complement} = location
  const {type, maintenanceFee} = homeDetails
  const {suites} = rooms
  const {priceRequestId, userPrice} = pricing

  return {
    complement,
    maintenanceFee: parseInt(maintenanceFee),
    priceRequestId,
    price: userPrice,
    suites,
    type
  }
}
