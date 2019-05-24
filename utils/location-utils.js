import {cities} from 'constants/cities'
import slugify from 'slug'
export const DEFAULT_CITY_SLUG = 'sao-paulo'
export const DEFAULT_CITY = cities.find(
  (city) => city.citySlug === DEFAULT_CITY_SLUG
)

class LocationUtils {
  static getUserLocationByIp(callback = () => {}) {
    return fetch('/location', {method: 'POST'})
      .then((response) => response.json())
      .then((result) => {
        const userCity = LocationUtils.getCity(result)
        if (userCity) {
          let identify = new amplitude.Identify().set(
            'geoIpCity',
            userCity.name
          )
          amplitude.identify(identify)
          return userCity
        } else {
          return DEFAULT_CITY
        }
      })
      .catch(() => DEFAULT_CITY)
  }

  static getCity = (result) => {
    if (result && result.location && result.location.city) {
      const {city} = result.location
      const citySlug = slugify(city.toLowerCase())
      const cityFound = cities.find((city) => city.citySlug === citySlug)
      const userCity = cityFound ? cityFound : DEFAULT_CITY
      return userCity
    }
    return null
  }
}

export default LocationUtils
