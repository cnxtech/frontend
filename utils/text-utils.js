const createNumberMask = require('text-mask-addons/dist/createNumberMask').default
const startCase = require('lodash/startCase')

const getParagraphs = (text) => {
  if (text) {
    return text.match(/^.*((\r\n|\n|\r)|$)/gm)
  }
}

const getUrlVars = (url) => {
  const vars = {}
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    vars[key] = value
  })
  return vars
}

const arrayToString = (arr) => {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += startCase(arr[i])
    if (i < arr.length - 1) {
      str += ', '
    }
  }
  return str
}

const currencyToInt = (displayPrice) => {
  const cleanPrice = displayPrice.replace(PREFIX, '').split(THOUSANDS_SEPARATOR_SYMBOL).join('')
  const intPrice = parseInt(cleanPrice)
  return intPrice
}

const intToCurrency = (val) =>
  Number(val || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

const roundUpPrice = (price) => {
  const base = 10000
  return Math.ceil(price/base) * base
}

const currencyStyle = {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}

const PREFIX = 'R$ '
const THOUSANDS_SEPARATOR_SYMBOL = '.'

const currencyInputMask = createNumberMask({
  prefix: PREFIX,
  thousandsSeparatorSymbol: THOUSANDS_SEPARATOR_SYMBOL,
  integerLimit: 12
})

const formatRange = (values, formatFn = (x) => x) => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min == max) return formatFn(min)
  else return `${formatFn(min)} - ${formatFn(max)}`
}

/**
 * Clears a phone string to match the format `+5511222223333`.
 *
 * @param {string} phoneString
 */
const clearPhoneString = (phoneString) => {
  if (!phoneString) {
    return phoneString
  }
  return phoneString.replace('(', '').replace(')', '').replace(/ /g, '').replace('-', '').replace(/_/g, '')
}

/**
 * Returns a phone mask to be used in Inputs.
 */
const getPhoneMask = (value) => {
  const cleanValue = value ? clearPhoneString(value) : ''
  if (cleanValue.length <= 10) {
    return ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  } else {
    return ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }
}

module.exports = {
  getParagraphs,
  getUrlVars,
  currencyStyle,
  currencyInputMask,
  currencyToInt,
  intToCurrency,
  roundUpPrice,
  arrayToString,
  formatRange,
  getPhoneMask,
  clearPhoneString,
  PREFIX,
  THOUSANDS_SEPARATOR_SYMBOL
}
