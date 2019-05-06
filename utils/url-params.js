const _ = require('lodash')
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
  quartos: {
    name: 'rooms',
    aggregation: 'range',
    aggregationKeys: ['min', 'max']
  },
  quartos: {
    name: 'rooms',
    aggregation: 'range',
    aggregationKeys: ['min', 'max']
  },
  casa: {name: 'types', value: 'Casa', aggregation: 'array'},
  apartamento: {name: 'types', value: 'Apartamento', aggregation: 'array'},
  cobertura: {name: 'types', value: 'Cobertura', aggregation: 'array'},
  'preco-minimo': {
    name: 'price',
    aggregation: 'range',
    aggregationKeys: ['min']
  },
  'preco-maximo': {
    name: 'price',
    aggregation: 'range',
    aggregationKeys: ['max']
  }
}
const STARTS_WITH_NUMBER = /^([0-9]+)-([a-z-]+)$/
const ENDS_WITH_NUMBER = /^([a-z-]+)-([0-9]+)$/

function isTag(path = '') {
  return TAGS.includes(path)
}

function isFeature(path = '') {
  return Object.keys(pathToTypeFilterMap).reduce(
    (accumulator, current) => accumulator || path.indexOf(current) >= 0,
    false
  )
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

const getRestParams = (rest = '') => {
  const splitedPaths = rest.split('/')
  if (splitedPaths && splitedPaths.length === 0) {
    return ''
  }
  const [firstPath, ...paths] = splitedPaths
  const restParams = {neighborhood: firstPath}
  restParams.tags = []
  restParams.filters = {}
  if (isTag(firstPath)) {
    delete restParams.neighborhood
    restParams.tags.push(firstPath)
  }
  if (isFeature(firstPath)) {
    delete restParams.neighborhood
    restParams.filters = aggregateFilter({}, firstPath)
  }
  if (paths && paths.length === 0) {
    return restParams
  }
  restParams.tags = restParams.tags.concat(_.intersection(paths, TAGS))
  const features = _.difference(paths, restParams.tags)
  features.forEach((feature) => aggregateFilter(restParams.filters, feature))
  return restParams
}
const buildParams = (req) => {
  const {state, city, rest} = req.params
  const restParams = getRestParams(rest)
  return {state, city, ...restParams}
}

module.exports = buildParams
