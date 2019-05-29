import {
  BUY_TITLE_BASE,
  BUY_TITLE_DEFAULT_END,
  BUY_TITLE_NEIGHBORHOOD_PREPOSITION,
  BUY_TITLE_CITY_PREPOSITION,
  CUSTOM_BUY_TITLE
} from 'constants/listing-locations'


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


function getRangeTitle(range) {
  if (range.hasOwnProperty('max') && range.hasOwnProperty('min')) {
    return ` de ${range.min} a ${range.max}`
  }

  if (range.hasOwnProperty('max')) {
    return ` até ${range.max}`
  }

  return ` a partir de ${range.min}`
}

function getTitleTextByParams(params, districts, format = false) {
  const title = [{text: BUY_TITLE_BASE}]
  const {citySlug, filters} = params
  const {tagsSlug, neighborhoods, rooms, price, garageSpots, area} = filters

  if (area) {
    title.push({text: getRangeTitle(area), bold: true})
  }

  if (rooms) {
    title.push({text: `${getRangeTitle(rooms)} quartos`, bold: true})
  }

  if (price) {
    title.push({text: getRangeTitle(price), bold: true})
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

  return format ? <span>{title.map(t => t.bold ? <strong>{t.text}</strong> : t.text)}</span> : title.map(t => t.text).join('')
}

export {
  getTitleTextByParams
}
