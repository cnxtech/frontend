import React from 'react'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import identity from 'lodash/identity'
import flow from 'lodash/fp/flow'
import cond from 'lodash/fp/cond'
import not from 'lodash/fp/negate'
import stubTrue from 'lodash/fp/stubTrue'
import curry from 'lodash/fp/curry'
import {
  MIN_PRICE,
  MAX_PRICE,
  MIN_AREA,
  MAX_AREA,
  PRICE_STEP
} from '@emcasa/ui-dom/components/Filters/constants'
import SliderRangeFilter from './SliderRangeFilter'
import ButtonRangeFilter from './ButtonRangeFilter'
import TypesFilter from './TypesFilter'
import NumberAbbreviate, {EXANDED_SUFIX} from 'utils/numbe-abbreviate'

const hasValue = (value) => typeof value !== 'undefined'

export const formatRange = (formatOptions) => {
  const formatFn =
    (isFunction(formatOptions) ? formatOptions : formatOptions.format) ||
    identity
  const fmt = Object.assign(
    {
      format: formatFn,
      empty: formatFn,
      max: formatFn,
      min: formatFn,
      range: formatFn
    },
    isObject(formatOptions) ? formatOptions : undefined
  )
  return cond([
    [({min, max}) => !min && !max, fmt.empty],
    [({min, max}) => min == max, ({min}) => fmt.format(min)],
    [({min}) => !min, ({max}) => fmt.max(max)],
    [({max}) => !max, ({min}) => fmt.min(min)],
    [stubTrue, ({min, max}) => fmt.range(min, max)]
  ])
}

export const formatSliderRange = curry((format, range) =>
  flow(
    (value) => {
      if (!value) return value
      return {
        min: value.min > range[0] ? value.min : undefined,
        max: value.max < range[1] ? value.max : undefined
      }
    },
    formatRange({
      format,
      empty: () => `${format(range[0])} - ${format(range[1])}`,
      max: (value) => `Até ${format(value)}`,
      min: (value) => `A partir de ${format(value)}`,
      range: (min, max) => `${format(min)} - ${format(max)}`
    })
  )
)

export const formatNumRange = (noun) => {
  const singular = noun
  const plural = `${noun}s`
  return formatRange({
    format: (value) => `${value} ${value === 1 ? singular : plural}`,
    empty: () => `Sem ${plural}`,
    min: (value) => `${value}+ ${value === 1 ? singular : plural}`,
    max: (value) => `Até ${value} ${value === 1 ? singular : plural}`,
    range: (min, max) => `De ${min} a ${max} ${plural}`
  })
}

export const formatPrice = (value) =>
  `R$ ${NumberAbbreviate.abbreviate(value, 2, EXANDED_SUFIX)
    .toString()
    .replace('.', ',')}`

const formatPriceRange = formatSliderRange(formatPrice)

const formatAreaRange = formatSliderRange((value) => `${value} m²`)

const PriceFilter = ({step, ...props}) => (
  <SliderRangeFilter
    formatValue={(value) => Math.round(value / step) * step}
    formatLabel={cond([
      [not(hasValue), () => props.title],
      [stubTrue, formatPriceRange(props.range)]
    ])}
    {...props}
  />
)

PriceFilter.initialValue = {min: MIN_PRICE, max: MAX_PRICE}

PriceFilter.defaultProps = {
  name: 'price',
  title: 'Valor',
  step: PRICE_STEP,
  range: [PriceFilter.initialValue.min, PriceFilter.initialValue.max]
}

const RoomsFilter = ({...props}) => (
  <ButtonRangeFilter
    formatEmpty={() => 'Sem quartos'}
    formatLast={() => '5 ou +'}
    {...props}
  />
)

RoomsFilter.defaultProps = {
  name: 'rooms',
  formatLabel: cond([
    [not(hasValue), () => 'Quartos'],
    [stubTrue, formatNumRange('quarto')]
  ]),
  title: 'Quartos',
  range: [1, 5]
}

const AreaFilter = ({...props}) => (
  <SliderRangeFilter
    formatValue={Math.round}
    formatLabel={cond([
      [not(hasValue), () => 'Área'],
      [stubTrue, formatAreaRange(props.range)]
    ])}
    {...props}
  />
)

AreaFilter.initialValue = {min: MIN_AREA, max: MAX_AREA}

AreaFilter.defaultProps = {
  name: 'area',
  label: 'Área (m²)',
  title: 'Área (m²)',
  range: [AreaFilter.initialValue.min, AreaFilter.initialValue.max]
}

const GarageSpotsFilter = ({...props}) => (
  <ButtonRangeFilter
    formatEmpty={() => 'Sem vagas'}
    formatLast={() => '5 ou +'}
    {...props}
  />
)

GarageSpotsFilter.defaultProps = {
  name: 'garageSpots',
  title: 'Vagas de garagem',
  formatLabel: cond([
    [not(hasValue), () => 'Vagas'],
    [stubTrue, formatNumRange('vaga')]
  ]),
  range: [0, 5]
}

export {PriceFilter, RoomsFilter, TypesFilter, GarageSpotsFilter, AreaFilter}
