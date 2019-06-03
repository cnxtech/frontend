export const EXANDED_SUFIX = [
  'mil',
  {plural: 'milhões', singular: 'milhão'},
  {plural: 'bilhões', singular: 'bilhão'},
  {plural: 'trilhões', singular: 'trilhão'}
]
export default class NumberAbbreviate {
  static sumSuffix(number, suffix) {
    if (typeof suffix === 'object') {
      if (number - 1 < 1) {
        return `${number} ${suffix.singular}`
      }
      return `${number} ${suffix.plural}`
    }
    return `${number} ${suffix}`
  }

  static _innerAbbreviate(number, decPlaces = 0, units) {
    decPlaces = Math.pow(10, decPlaces)
    for (let i = units.length - 1; i >= 0; i--) {
      let size = Math.pow(10, (i + 1) * 3)
      if (size <= number) {
        number = Math.round(number * decPlaces / size) / decPlaces
        if (number === 1000 && i < units.length - 1) {
          number = 1
          i++
        }
        return NumberAbbreviate.sumSuffix(number, units[i])
      }
    }

    return number
  }
  static abbreviate(number, decPlaces, units = ['k', 'm', 'b', 't']) {
    const isNegative = number < 0
    const abbreviatedNumber = NumberAbbreviate._innerAbbreviate(
      Math.abs(number),
      decPlaces,
      units
    )

    return isNegative ? '-' + abbreviatedNumber : abbreviatedNumber
  }
}
