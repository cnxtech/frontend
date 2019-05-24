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
          stateSlug: 'state',
          citySlug: 'city',
          filters: {
            citySlug: 'city',
            neighborhoods: ['neighborhood'],
            stateSlug: 'state'
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
          stateSlug: 'state',
          citySlug: 'city',
          filters: {
            citySlug: 'city',
            stateSlug: 'state',
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
          stateSlug: 'state',
          citySlug: 'city',
          filters: {
            citySlug: 'city',
            stateSlug: 'state',
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
          stateSlug: 'state',
          citySlug: 'city',
          filters: {
            citySlug: 'city',
            neighborhoods: ['neighborhood'],
            stateSlug: 'state',
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
          stateSlug: 'state',
          citySlug: 'city',
          filters: {
            types: ['Casa'],
            citySlug: 'city',
            stateSlug: 'state',
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
          stateSlug: 'state',
          citySlug: 'city',
          filters: {
            types: ['Casa'],
            citySlug: 'city',
            stateSlug: 'state',
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
        stateSlug: 'state',
        citySlug: 'city',
        filters: {
          price: {min: 10000},
          citySlug: 'city',
          stateSlug: 'state'
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
        stateSlug: 'state',
        citySlug: 'city',
        filters: {
          price: {min: 10000, max: 1000000000},
          citySlug: 'city',
          stateSlug: 'state'
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
        stateSlug: 'state',
        citySlug: 'city',
        filters: {
          price: {min: 10000, max: 1000000000},
          rooms: {min: 3, max: 3},
          citySlug: 'city',
          stateSlug: 'state'
        }
      }
      expect(result).toEqual(expected)
    })

    it('should return only city and state when rest param is null', () => {
      //simulates => /imoveis/state/city
      const result = ParamsMapper.mapUrlToParams({
        city: 'city',
        state: 'state'
      })
      const expected = {
        stateSlug: 'state',
        citySlug: 'city',
        filters: {
          citySlug: 'city',
          stateSlug: 'state'
        }
      }
      expect(result).toEqual(expected)
    })

    it('should return empty object when empty params is given', () => {
      //simulates => /imoveis/state/city/preco-min-10000
      const result = ParamsMapper.mapUrlToParams({})
      const expected = {}
      expect(result).toEqual(expected)
    })
  })

  describe('mapParamsToUrl(params, filters)', () => {
    it('should map filters (state, city, type and ranged price) to path starting with /state/city', () => {
      const filters = {
        citySlug: 'sao-paulo',
        stateSlug: 'sp',
        types: ['Casa'],
        price: {min: 100000, max: 10000000}
      }

      const result = ParamsMapper.mapParamsToUrl(filters)
      expect(result).toEqual(
        '/sp/sao-paulo/casa/preco-min-100000/preco-max-10000000'
      )
    })

    it('should map filters (type and ranged price) to path starting with /state/city', () => {
      const filters = {
        citySlug: 'sao-paulo',
        stateSlug: 'sp',
        types: ['Casa'],
        price: {min: 100000, max: 10000000},
        area: {min: 200, max: 400}
      }

      const result = ParamsMapper.mapParamsToUrl(filters)
      expect(result).toEqual(
        '/sp/sao-paulo/casa/preco-min-100000/preco-max-10000000/area-min-200/area-max-400'
      )
    })

    it(
      'should map filters (type and ranged price - max and min ' +
      'equals) to path starting with /state/city and quartos should contains only value and label',
      () => {
        const filters = {
          citySlug: 'sao-paulo',
          stateSlug: 'sp',
          types: ['Casa'],
          rooms: {min: 3, max: 3}
        }
        const result = ParamsMapper.mapParamsToUrl(filters)
        expect(result).toEqual('/sp/sao-paulo/casa/3-quartos')

        const filters2 = {
          citySlug: 'sao-paulo',
          stateSlug: 'sp',
          types: ['Casa'],
          garageSpots: {min: 3, max: 3}
        }
        const result2 = ParamsMapper.mapParamsToUrl(filters2)
        expect(result2).toEqual('/sp/sao-paulo/casa/3-vagas')
      }
    )

    it(
      'should map filters (type and neighborhood) to path ' +
      'starting with /state/city',
      () => {
        const filters = {
          citySlug: 'sao-paulo',
          stateSlug: 'sp',
          types: ['Casa'],
          neighborhoods: ['neighborhoods', 'neighborhoods1'],
          rooms: {min: 3, max: 3}
        }

        let result = ParamsMapper.mapParamsToUrl(filters)
        expect(result).toEqual(
          '/sp/sao-paulo/neighborhoods/neighborhoods1/casa/3-quartos'
        )
        filters.neighborhoods = ['neighborhoods']
        result = ParamsMapper.mapParamsToUrl(filters)
        expect(result).toEqual('/sp/sao-paulo/neighborhoods/casa/3-quartos')
      }
    )
  })
})
