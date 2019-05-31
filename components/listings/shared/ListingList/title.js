import {
  BUY_TITLE_BASE,
  BUY_TITLE_DEFAULT_END,
  BUY_TITLE_NEIGHBORHOOD_PREPOSITION,
  BUY_TITLE_CITY_PREPOSITION,
  BUY_TITLE_BY_TYPE,
  TYPES_PLURAL,
  CUSTOM_BUY_TITLE
} from 'constants/listing-locations'
import * as tags from 'components/shared/Filter/components/TagsFilter/constansts'
import {intToCurrency} from 'utils/text-utils'

const tagsBySlug = Object.keys(tags).reduce((obj, key) => {
  tags[key].forEach(tag => {
    obj[tag.value] = tag.label
  })
  return obj
}, {})

function getCityTitle(citySlug, districts) {
  const custom = CUSTOM_BUY_TITLE.find(a => a.citySlug === citySlug)
  const location = districts.find(a => a.citySlug === citySlug)
  const cityTitle = location ? ` ${BUY_TITLE_CITY_PREPOSITION} ${location.city} - ${location.state}` : ` ${BUY_TITLE_DEFAULT_END}`

  return custom ? ` ${custom.value}` : cityTitle
}

function getNeighborhoodTitle(neighborhoodSlugs, districts) {
  const info = districts.filter(a => neighborhoodSlugs.find(s => s === a.nameSlug)).map(b => b.name)
  return ` ${BUY_TITLE_NEIGHBORHOOD_PREPOSITION} ${info.join(', ')}`
}

function getRangeTitle(min, max, formatter = (a => a)) {
  let title = null

  if (min && max) {
    if (max === min) {
      title = ` ${formatter(min)}`
    } else {
      title = ` de ${formatter(min)} a ${formatter(max)}`
    }
  } else if (max) {
    title = ` até ${formatter(max)}`
  } else {
    title = ` a partir de ${formatter(min)}`
  }

  return title
}

function getTypeTitle(types) {
  if (types.length === 1) {
    return BUY_TITLE_BY_TYPE[types[0]]
  }

  return types.map(t => TYPES_PLURAL[t]).join(', ')
}

function getTitleTextByFilters(filters, districts, format = false) {
  const {
    tagsSlug,
    neighborhoodSlugs,
    citiesSlug,
    minRooms,
    maxRooms,
    minPrice,
    maxPrice,
    minGarageSpots,
    maxGarageSpots,
    minArea,
    maxArea,
    types
  } = filters || {}

  const title = [{text: types ? getTypeTitle(types) : BUY_TITLE_BASE}]

  if (minArea || maxArea) {
    title.push({
      text: getRangeTitle(minArea, maxArea, a => `${a}m²`),
      bold: true
    })
  }

  if (minRooms || maxRooms) {
    title.push({
      text: `${getRangeTitle(minRooms, maxRooms)} quartos`,
      bold: true
    })
  }

  if (minPrice || maxPrice) {
    title.push({
      text: getRangeTitle(minPrice, maxPrice, intToCurrency),
      bold: true
    })
  }

  if (minGarageSpots || maxGarageSpots) {
    title.push({
      text: `${getRangeTitle(minGarageSpots, maxGarageSpots)} vagas`,
      bold: true
    })
  }

  if (tagsSlug) {
    title.push({
      text: ` com ${tagsSlug.map(slug => tagsBySlug[slug]).join(', ')}`,
      bold: true
    })
  }

  if (neighborhoodSlugs) {
    title.push({text: getNeighborhoodTitle(neighborhoodSlugs, districts)})
  } else if (citiesSlug) {
    title.push({text: getCityTitle(citiesSlug[0], districts)})
  } else {
    title.push({text: ` ${BUY_TITLE_DEFAULT_END}`})
  }

  return format ? (
    <span>
      {title.map((t, i) => t.bold ? <strong key={i}>{t.text}, </strong> : t.text)}
    </span>
  ) : title.map(t => t.text).join('')
}

export {
  getTitleTextByFilters
}
