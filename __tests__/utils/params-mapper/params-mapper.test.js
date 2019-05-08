import ParamsMapper from 'utils/params-mapper'

describe('Parameters Mapper tests', () => {
  describe('.mapUrlToParams(params)', () => {
    it(
      'should identify first path after state and city paths as' +
        'neighborhood when it doesn\'t match any tag or feature',
      () => {
        //simulates => /imoveis/state/city/neighborhood
        const result = ParamsMapper.mapUrlToParams({
          state: 'state',
          city: 'city',
          rest: 'neighborhood'
        })
        const expected = {
          state: 'state',
          city: 'city',
          filters: {
            citiesSlug: ['city'],
            neighborhoods: ['neighborhood']
          }
        }
        expect(result).toEqual(expected)
      }
    )

    it(
      'should identify first path after state and city paths as' +
        'tag when it matches with defined tags',
      () => {
        //simulates => /imoveis/state/city/piscina
        const result = ParamsMapper.mapUrlToParams({
          state: 'state',
          city: 'city',
          rest: 'piscina'
        })
        const expected = {
          state: 'state',
          city: 'city',
          filters: {
            citiesSlug: ['city'],
            tagsSlug: ['piscina']
          }
        }
        expect(result).toEqual(expected)
      }
    )

    it(
      'should identify first path after state and city paths as' +
        'filter when it matches with defined filters',
      () => {
        //simulates => /imoveis/state/city/casa
        const result = ParamsMapper.mapUrlToParams({
          state: 'state',
          city: 'city',
          rest: 'casa'
        })
        const expected = {
          state: 'state',
          city: 'city',
          filters: {
            citiesSlug: ['city'],
            types: ['Casa']
          }
        }
        expect(result).toEqual(expected)
      }
    )

    it(
      'should identify first path after state and city paths as' +
        'neighborhood and the second as a tag',
      () => {
        //simulates => /imoveis/state/city/neighborhood/piscina
        const result = ParamsMapper.mapUrlToParams({
          state: 'state',
          city: 'city',
          rest: 'neighborhood/piscina'
        })
        const expected = {
          state: 'state',
          city: 'city',
          filters: {
            citiesSlug: ['city'],
            neighborhoods: ['neighborhood'],
            tagsSlug: ['piscina']
          }
        }
        expect(result).toEqual(expected)
      }
    )
    it(
      'should identify first path after state and city paths as' +
        'neighborhood and the second as a filter',
      () => {
        //simulates => /imoveis/state/city/neighborhood/casa
        const result = ParamsMapper.mapUrlToParams({
          state: 'state',
          city: 'city',
          rest: 'neighborhood/casa'
        })
        const expected = {
          state: 'state',
          city: 'city',
          filters: {
            types: ['Casa'],
            citiesSlug: ['city'],
            neighborhoods: ['neighborhood']
          }
        }
        expect(result).toEqual(expected)
      }
    )

    it(
      'should identify first path after state and city paths as' +
        ' filter and the second as a tag',
      () => {
        //simulates => /imoveis/state/city/casa/piscina
        const result = ParamsMapper.mapUrlToParams({
          state: 'state',
          city: 'city',
          rest: 'casa/piscina'
        })
        const expected = {
          state: 'state',
          city: 'city',
          filters: {
            types: ['Casa'],
            citiesSlug: ['city'],
            tagsSlug: ['piscina']
          }
        }
        expect(result).toEqual(expected)
      }
    )

    it('should identify "preco minimo" as a filter', () => {
      //simulates => /imoveis/state/city/preco-min-10000
      const result = ParamsMapper.mapUrlToParams({
        state: 'state',
        city: 'city',
        rest: 'preco-min-10000'
      })
      const expected = {
        state: 'state',
        city: 'city',
        filters: {
          price: {min: 10000},
          citiesSlug: ['city']
        }
      }
      expect(result).toEqual(expected)
    })

    it('should identify "preco minimo" and "preco-maximo" as a filter', () => {
      //simulates => /imoveis/state/city/preco-min-10000
      const result = ParamsMapper.mapUrlToParams({
        state: 'state',
        city: 'city',
        rest: 'preco-min-10000/preco-max-1000000000'
      })
      const expected = {
        state: 'state',
        city: 'city',
        filters: {
          price: {min: 10000, max: 1000000000},
          citiesSlug: ['city']
        }
      }
      expect(result).toEqual(expected)
    })

    it('should identify "quartos" and "preco minimo" and "preco-maximo" as a filter', () => {
      //simulates => /imoveis/state/city/preco-min-10000
      const result = ParamsMapper.mapUrlToParams({
        state: 'state',
        city: 'city',
        rest: '3-quartos/preco-min-10000/preco-max-1000000000'
      })
      const expected = {
        state: 'state',
        city: 'city',
        filters: {
          price: {min: 10000, max: 1000000000},
          rooms: {min: 3, max: 3},
          citiesSlug: ['city']
        }
      }
      expect(result).toEqual(expected)
    })
  })
  describe('mapParamsToUrl(params, filters)', () => {
    it('should map state, city, type and ranged price correctly', () => {
      const params = {
        city: 'city',
        state: 'state'
      }
      const filters = {
        types: ['Casa'],
        price: {min: 100000, max: 10000000}
      }

      const result = ParamsMapper.mapParamsToUrl(params, filters)
      expect(result).toEqual(
        '/state/city/casa/preco-min-100000/preco-max-10000000'
      )
    })
  })
})
