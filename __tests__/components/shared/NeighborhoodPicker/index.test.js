import {shallow} from 'enzyme'
import {cities} from 'constants/cities'
import NeighborhoodPicker, {
  DEFAULT_CITY_SLUG,
  DEFAULT_CITY
} from 'components/shared/NeighborhoodPicker'

describe('NeighborhoodPicker component', () => {
  it('default city should be São Paulo', () => {
    expect(DEFAULT_CITY_SLUG).toBe('sao-paulo')
    expect(DEFAULT_CITY.citySlug).toBe('sao-paulo')
  })

  it('should return user city as São Paulo when no location could be determined', () => {
    const geolocationResult = null
    const component = shallow(<NeighborhoodPicker />)
    const userCity = component.dive().instance().getUserCityByGeoIp(geolocationResult)
    expect(userCity).toBe(null)
  })

  it('should return user city as Rio when user location is determined to be Rio', () => {
    const geolocationResult = {
      location: {
        city: 'Rio de Janeiro'
      }
    }
    const component = shallow(<NeighborhoodPicker />)
    const userCity = component.dive().instance().getUserCityByGeoIp(geolocationResult)
    expect(userCity).toBe(cities[1])
  })

  it('should return user city as São Paulo when user location is determined to be São Paulo', () => {
    const geolocationResult = {
      location: {
        city: 'São Paulo'
      }
    }
    const component = shallow(<NeighborhoodPicker />)
    const userCity = component.dive().instance().getUserCityByGeoIp(geolocationResult)
    expect(userCity).toBe(cities[0])
  })
})
