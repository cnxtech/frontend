import {
  BUY_TITLE_BASE,
  BUY_TITLE_DEFAULT_END,
  BUY_TITLE_NEIGHBORHOOD_PREPOSITION,
  BUY_TITLE_CITY_PREPOSITION,
  CUSTOM_BUY_TITLE
} from 'constants/listing-locations'
import {intToCurrency} from 'utils/text-utils'

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

function getRangeTitle(range, formatter = (a => a)) {
  let title = null

  if (range.hasOwnProperty('max') && range.hasOwnProperty('min')) {
    if (range.max === range.min) {
      title = ` ${formatter(range.min)}`
    } else {
      title = ` de ${formatter(range.min)} a ${formatter(range.max)}`
    }
  } else if (range.hasOwnProperty('max')) {
    title = ` até ${formatter(range.max)}`
  } else {
    title = ` a partir de ${formatter(range.min)}`
  }

  return title
}

function getTitleTextByParams(params, districts, format = false) {
  const title = [{text: BUY_TITLE_BASE}]
  const {citySlug, filters} = params
  const {tagsSlug, neighborhoods, rooms, price, garageSpots, area} = filters || {}

  if (area) {
    title.push({text: getRangeTitle(area, a => `${a}m²`), bold: true})
  }

  if (rooms) {
    title.push({text: `${getRangeTitle(rooms)} quartos`, bold: true})
  }

  if (price) {
    title.push({text: getRangeTitle(price, intToCurrency), bold: true})
  }

  if (garageSpots) {
    title.push({text: `${getRangeTitle(garageSpots)} vagas`, bold: true})
  }

  if (tagsSlug) {
    title.push({text: ` com ${tagsSlug.join(', ')}`, bold: true})
  }

  if (neighborhoods) {
    title.push({text: getNeighborhoodTitle(neighborhoods, districts)})
  } else if (citySlug) {
    title.push({text: getCityTitle(citySlug, districts)})
  } else {
    title.push({text: ` ${BUY_TITLE_DEFAULT_END}`})
  }

  return format ? <span>{title.map((t, i) => t.bold ? <strong key={i}>{t.text}, </strong> : t.text)}</span> : title.map(t => t.text).join('')
}

export {
  getTitleTextByParams
}
