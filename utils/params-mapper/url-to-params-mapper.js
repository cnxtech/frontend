const _ = require('lodash')
const {cities} = require('../../constants/cities')

const TAGS = [
  'academia',
  'churrasqueira',
  'espaco-gourmet',
  'espaco-verde',
  'parque',
  'piscina',
  'playground',
  'quadra',
  'salao-de-festas',
  'salao-de-jogos',
  'sauna',
  'armarios-embutidos',
  'banheiro-empregados',
  'bom-para-pets',
  'dependencia-empregados',
  'espaco-para-churrasco',
  'fogao-embutido',
  'lavabo',
  'reformado',
  'sacada',
  'terraco',
  'vaga-na-escritura',
  'varanda',
  'varanda-gourmet',
  'bicicletario',
  'brinquedoteca',
  'portaria-24-horas',
  'portaria-horario-comercial',
  'vista-comunidade',
  'vista-cristo',
  'vista-lagoa',
  'vista-mar',
  'vista-montanhas',
  'vista-parcial-comunidade',
  'vista-parcial-mar',
  'vista-pedras',
  'vista-verde',
  'vista-vizinho',
  'vista-pao-de-acucar',
  'portaria-eletronica'
]
const pathToTypeFilterMap = {
  'quartos-min': {
    name: 'rooms',
    aggregation: 'range',
    aggregationKeys: ['min']
  },
  'quartos-max': {
    name: 'rooms',
    aggregation: 'range',
    aggregationKeys: ['max']
  },
  quartos: {
    name: 'rooms',
    aggregation: 'range',
    aggregationKeys: ['min', 'max']
  },
  quarto: {
    name: 'rooms',
    aggregation: 'range',
    aggregationKeys: ['min', 'max']
  },
  casa: {name: 'types', value: 'Casa', aggregation: 'array'},
  apartamento: {name: 'types', value: 'Apartamento', aggregation: 'array'},
  cobertura: {name: 'types', value: 'Cobertura', aggregation: 'array'},
  'preco-min': {
    name: 'price',
    aggregation: 'range',
    aggregationKeys: ['min']
  },
  'preco-max': {
    name: 'price',
    aggregation: 'range',
    aggregationKeys: ['max']
  },
  'area-min': {
    name: 'area',
    aggregation: 'range',
    aggregationKeys: ['min']
  },
  'area-max': {
    name: 'area',
    aggregation: 'range',
    aggregationKeys: ['max']
  },
  'vagas-min': {
    name: 'garageSpots',
    aggregation: 'range',
    aggregationKeys: ['min']
  },
  'vagas-max': {
    name: 'garageSpots',
    aggregation: 'range',
    aggregationKeys: ['max']
  },
  vagas: {
    name: 'garageSpots',
    aggregation: 'range',
    aggregationKeys: ['min', 'max']
  },
  vaga: {
    name: 'garageSpots',
    aggregation: 'range',
    aggregationKeys: ['min', 'max']
  }
}
const STARTS_WITH_NUMBER = /^([0-9]+)-([a-z-]+)$/
const ENDS_WITH_NUMBER = /^([a-z-]+)-([0-9]+)$/

function isFeature(path = '') {
  return Object.keys(pathToTypeFilterMap).reduce(
    (accumulator, current) => accumulator || path.indexOf(current) >= 0,
    false
  )
}

function filterNeighborhoods(neighborhoods) {
  const exclusion = ['imoveis', 'bairros', '', 'busca']
  return neighborhoods.filter((item) => {
    let isCityOrState = false
    cities.forEach((city) => {
      if (item === city.citySlug || item === city.stateSlug) {
        isCityOrState = true
      }
    })
    if (isCityOrState) {
      return false
    }
    if (exclusion.includes(item)) {
      return false
    }
    return true
  })
}

function getKeyValuePath(path) {
  let match = path.match(STARTS_WITH_NUMBER)
  if (match) {
    const [, value, key] = match
    return {key, value: parseInt(value, 10)}
  }

  match = path.match(ENDS_WITH_NUMBER)
  if (match) {
    const [, key, value] = match
    return {key, value: parseInt(value, 10)}
  }
  return null
}

function aggregateFilter(filters = {}, path) {
  const withValuePath = getKeyValuePath(path)
  let aggregator = withValuePath || {key: path}

  const filterDefinition = pathToTypeFilterMap[aggregator.key]
  if (!filterDefinition) {
    // TODO Check what to do when this case happens
    return filters
  }
  switch (filterDefinition.aggregation) {
    case 'array': {
      if (!filters[filterDefinition.name]) {
        filters[filterDefinition.name] = []
      }
      filters[filterDefinition.name].push(filterDefinition.value)
      break
    }
    case 'range': {
      if (!filters[filterDefinition.name]) {
        filters[filterDefinition.name] = {}
      }
      filterDefinition.aggregationKeys.forEach(
        (key) => (filters[filterDefinition.name][key] = aggregator.value)
      )
      break
    }
    default:
      return filters
  }
  return filters
}

const getFiltersByPath = (rest = '') => {
  const paths = rest.split('/')
  if (rest.length === 0 || (!paths || paths.length === 0)) {
    return {}
  }
  const filters = {}
  const tags = _.intersection(paths, TAGS)
  if (tags && tags.length > 0) {
    filters.tagsSlug = tags
  }
  const features = _.filter(paths, isFeature)
  if (features && features.length > 0) {
    features.forEach((feature) => aggregateFilter(filters, feature))
  }
  const featuresAndTags = [...tags, ...features]
  let neighborhoods = _.difference(paths, featuresAndTags)
  neighborhoods = filterNeighborhoods(neighborhoods)
  if (neighborhoods && neighborhoods.length > 0) {
    filters.neighborhoods = neighborhoods
  }
  return filters
}

const mapUrlToParams = (params) => {
  const {state, city, rest} = params
  const filters = getFiltersByPath(rest)
  const newParams = {}
  if (city) {
    filters.citiesSlug = [city]
    newParams.city = city
  }

  if (state) {
    newParams.state = state
  }

  if (Object.keys(filters).length > 0) {
    newParams.filters = filters
  }
  return newParams
}

module.exports = {mapUrlToParams, getFiltersByPath}
