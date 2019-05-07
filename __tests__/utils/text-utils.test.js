import {
  getParagraphs,
  currencyToInt,
  roundUpPrice,
  getUrlVars,
  arrayToString,
  getPhoneMask,
  clearPhoneString
} from 'utils/text-utils'

describe('currency formatting', () => {
  it('should transform currency display value into an integer', () =>{
    const displayValue = 'R$ 200.000'
    const intValue = currencyToInt(displayValue)
    expect(intValue).toBe(200000)
  })

  it('should transform currency values with more than one thousand separator into an integer', () =>{
    const displayValue = 'R$ 50.200.000'
    const intValue = currencyToInt(displayValue)
    expect(intValue).toBe(50200000)
  })

  it('should round up a price value', () => {
    const price = 1234567
    const roundedPrice = roundUpPrice(price)
    expect(roundedPrice).toBe(1240000)
  })
})

describe('phone mask', () => {
  it('should return a phone mask for an 8 digit number', () => {
    const mask = getPhoneMask('11')
    expect(mask).toEqual(["(", /\d/, /\d/, ")", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/])
  })

  it('should return a phone mask for a 9 digit number', () => {
    const mask = getPhoneMask('11111111111')
    expect(mask).toEqual(["(", /\d/, /\d/, ")", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/])
  })

  it('should return numbers only from a formatted phone number string', () => {
    const formattedPhoneNumber = '+55 (11) 22222-3333'
    const phone = clearPhoneString(formattedPhoneNumber)
    expect(phone).toBe('+5511222223333')
  })

  it('should return null when null is passed to the clear phone function', () => {
    const formattedPhoneNumber = null
    const phone = clearPhoneString(formattedPhoneNumber)
    expect(phone).toBe(null)
  })
})

describe('text utils', () => {
  it('should return an array of paragraphs from a string of text', () => {
    const text = 'One paragraph.\nTwo paragraphs.\nThree paragraphs.'
    expect(getParagraphs(text)[0]).toBe('One paragraph.\n')
    expect(getParagraphs(text)[1]).toBe('Two paragraphs.\n')
    expect(getParagraphs(text)[2]).toBe('Three paragraphs.')
  })

  it('should return undefined if no text is passed to getParagraphs', () => {
    const text = null
    expect(getParagraphs(text)).toBe(undefined)
  })

  it('should return url vars', () => {
    const url = 'https://emcasa.com/test?a=123&b=456'
    const urlVars = getUrlVars(url)
    expect(urlVars.a).toBe('123')
    expect(urlVars.b).toBe('456')
  })

  it('should transform an array of strings of one string into a text', () => {
    const arr = ['copacabana']
    const text = arrayToString(arr)
    expect(text).toBe('Copacabana')
  })

  it('should transform an array of strings into a text', () => {
    const arr = ['copacabana', 'ipanema', 'botafogo']
    const text = arrayToString(arr)
    expect(text).toBe('Copacabana, Ipanema, Botafogo')
  })
})
