import buildParams from 'utils/url-params'
describe('URL Parameters Function', () => {
  it(
    'should identify first path after state and city paths as' +
      'neighborhood when it doesn\'t match any tag or feature',
    () => {
      //simulates => /imoveis/state/city/neighborhood
      const req = {
        params: {state: 'state', city: 'city', rest: 'neighborhood'}
      }
      const result = buildParams(req)
      const expected = {
        state: 'state',
        city: 'city',
        filters: {},
        tags: [],
        neighborhood: 'neighborhood'
      }
      expect(result).toEqual(expected)
    }
  )

  it(
    'should identify first path after state and city paths as' +
      'tag when it matches with defined tags',
    () => {
      //simulates => /imoveis/state/city/piscina
      const req = {
        params: {state: 'state', city: 'city', rest: 'piscina'}
      }
      const result = buildParams(req)
      const expected = {
        state: 'state',
        city: 'city',
        filters: {},
        tags: ['piscina']
      }
      expect(result).toEqual(expected)
    }
  )

  it(
    'should identify first path after state and city paths as' +
      'filter when it matches with defined filters',
    () => {
      //simulates => /imoveis/state/city/casa
      const req = {
        params: {state: 'state', city: 'city', rest: 'casa'}
      }
      const result = buildParams(req)
      const expected = {
        state: 'state',
        city: 'city',
        filters: {
          types: ['Casa']
        },
        tags: []
      }
      expect(result).toEqual(expected)
    }
  )

  it(
    'should identify first path after state and city paths as' +
      'neighborhood and the second as a tag',
    () => {
      //simulates => /imoveis/state/city/neighborhood/piscina
      const req = {
        params: {state: 'state', city: 'city', rest: 'neighborhood/piscina'}
      }
      const result = buildParams(req)
      const expected = {
        state: 'state',
        city: 'city',
        filters: {},
        tags: ['piscina'],
        neighborhood: 'neighborhood'
      }
      expect(result).toEqual(expected)
    }
  )
  it(
    'should identify first path after state and city paths as' +
      'neighborhood and the second as a filter',
    () => {
      //simulates => /imoveis/state/city/neighborhood/casa
      const req = {
        params: {state: 'state', city: 'city', rest: 'neighborhood/casa'}
      }
      const result = buildParams(req)
      const expected = {
        state: 'state',
        city: 'city',
        filters: {
          types: ['Casa']
        },
        tags: [],
        neighborhood: 'neighborhood'
      }
      expect(result).toEqual(expected)
    }
  )

  it(
    'should identify first path after state and city paths as' +
      ' filter and the second as a tag',
    () => {
      //simulates => /imoveis/state/city/casa/piscina
      const req = {
        params: {state: 'state', city: 'city', rest: 'casa/piscina'}
      }
      const result = buildParams(req)
      const expected = {
        state: 'state',
        city: 'city',
        filters: {
          types: ['Casa']
        },
        tags: ['piscina']
      }
      expect(result).toEqual(expected)
    }
  )

  it('should identify "preco minimo" as a filter', () => {
    //simulates => /imoveis/state/city/preco-minimo-10000
    const req = {
      params: {state: 'state', city: 'city', rest: 'preco-minimo-10000'}
    }
    const result = buildParams(req)
    const expected = {
      state: 'state',
      city: 'city',
      filters: {
        price: {min: 10000}
      },
      tags: []
    }
    expect(result).toEqual(expected)
  })

  it('should identify "preco minimo" and "preco-maximo" as a filter', () => {
    //simulates => /imoveis/state/city/preco-minimo-10000
    const req = {
      params: {state: 'state', city: 'city', rest: 'preco-minimo-10000/preco-maximo-1000000000'}
    }
    const result = buildParams(req)
    const expected = {
      state: 'state',
      city: 'city',
      filters: {
        price: {min: 10000, max: 1000000000}
      },
      tags: []
    }
    expect(result).toEqual(expected)
  })

  it('should identify "quartos" and "preco minimo" and "preco-maximo" as a filter', () => {
    //simulates => /imoveis/state/city/preco-minimo-10000
    const req = {
      params: {state: 'state', city: 'city', rest: '3-quartos/preco-minimo-10000/preco-maximo-1000000000'}
    }
    const result = buildParams(req)
    const expected = {
      state: 'state',
      city: 'city',
      filters: {
        price: {min: 10000, max: 1000000000},
        rooms: {min: 3, max: 3}
      },
      tags: []
    }
    expect(result).toEqual(expected)
  })
})
