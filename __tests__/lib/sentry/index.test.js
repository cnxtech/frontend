import {ALLOW_URLS} from 'lib/sentry'

describe('sentry rules', () => {
  it('should match production url', () => {
    const productionRegex = ALLOW_URLS[0]
    expect('emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('www.emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('http://emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('https://emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('http://www.emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('https://www.emcasa.com'.match(productionRegex)).toBeTruthy()
  })

  it('should match staging url', () => {
    const productionRegex = ALLOW_URLS[1]
    expect('staging.emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('http://staging.emcasa.com'.match(productionRegex)).toBeTruthy()
    expect('https://staging.emcasa.com'.match(productionRegex)).toBeTruthy()
  })
})