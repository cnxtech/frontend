const filterToPathMapper = {
  price: {mapType: 'range', valuePosition: 'end', path: 'preco'},
  garageSpots: {mapType: 'range', valuePosition: 'start', path: 'vagas'},
  area: {mapType: 'range', valuePosition: 'end', path: 'area'},
  rooms: {mapType: 'range', valuePosition: 'start', path: 'quartos'},
  types: {mapType: 'array'}
}

function isAllValueEquals(object) {
  const values = Object.values(object)
  //we just want to check that when there are more than one key in the object
  if (values.length === 1) {
    return false
  }
  return values.every((value, i, arr) => value === arr[0])
}

function mapRangedFilter(mapper, value) {
  const keys = Object.keys(value)
  const paths = []
  switch (mapper.valuePosition) {
    case 'start': {
      if (isAllValueEquals(value)) {
        paths.push(`/${value[keys[0]]}-${mapper.path}`)
      } else {
        keys.forEach(
        (key) =>
          value[key] && paths.push(`/${value[key]}-${mapper.path}-${key}`)
      )
      }
      break
    }
    case 'end': {
      if (isAllValueEquals(value)) {
        paths.push(`/${mapper.path}-${value[keys[0]]}`)
      } else {
        keys.forEach(
        (key) =>
          value[key] && paths.push(`/${mapper.path}-${key}-${value[key]}`)
        )
      }
      break
    }
  }
  return paths
}

function mapFiltersToPath(filters = {}) {
  const keys = Object.keys(filters)
  let paths = []
  keys.forEach((key) => {
    const mapper = filterToPathMapper[key]
    if (mapper) {
      switch (mapper.mapType) {
        case 'array': {
          filters[key].forEach((value) =>
          paths.push('/'.concat(value.toLowerCase()))
        )
          break
        }
        case 'range': {
          paths = paths.concat(mapRangedFilter(mapper, filters[key]))
        }
      }
    }
  })
  return paths
}

function mapParamsToUrl(filters) {
  const {citySlug, stateSlug, neighborhoods, tagsSlug, ...filtersRest} = filters
  const filterPaths = mapFiltersToPath(filtersRest)
  let paths = []
  if (neighborhoods && neighborhoods.length > 0) {
    neighborhoods.forEach((neighborhood) =>
      paths.push('/'.concat(neighborhood))
    )
  }
  if (tagsSlug && tagsSlug.length > 0) {
    tagsSlug.forEach((tag) => paths.push('/'.concat(tag)))
  }
  paths = paths.concat(filterPaths)

  const startPath = `/${stateSlug}/${citySlug}`
  return `${startPath}${paths.join('')}`
}

module.exports = mapParamsToUrl
