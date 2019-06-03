import React from 'react'
import PropTypes from 'prop-types'
import ButtonGroupFilter from '../ButtonGroupFilter'
import {FilterButton} from '../shared/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'

export const selectStrategy = ({range: [_, max]}) => ({
  isSelected(range, value) {
    return range && range.min === value
  },
  update(_, value) {
    return {min: value, max: value == max ? undefined : value}
  }
})

export default function Index({
  range: [min, max],
  formatText,
  formatEmpty = formatText,
  formatFirst = formatText,
  formatLast = formatText,
  buttonProps,
  title,
  name,
  onChange,
  filters,
  ...props
}) {
  return (
    <Row flexDirection="column" my={5}>
      <Col>
        <Row flexDirection="row" alignItems="center">
          <Text fontSize="small" fontWeight="bold">
            {title}
          </Text>
        </Row>
      </Col>
      <Col justifyContent="center">
        <ButtonGroupFilter
          onChange={(value) => {
            onChange(name, value)
          }}
          name={name}
          currentValue={filters[name]}
          strategy={selectStrategy({range: [min, max]})}
          {...props}
        >
          {Array(max - min + 1)
            .fill(null)
            .map((_, index) => {
              const value = index + min
              const input = {index, value}
              return (
                <FilterButton heigth="small" key={index} value={value} {...buttonProps}>
                  {value == 0
                    ? formatEmpty(input)
                    : index == 0
                      ? formatFirst(input)
                      : value == max ? formatLast(input) : formatText(input)}
                </FilterButton>
              )
            })}
        </ButtonGroupFilter>
      </Col>
    </Row>
  )
}

Index.selectStrategy = selectStrategy

Index.defaultProps = {
  formatText: ({value}) => value,
  buttonProps: {}
}

Index.propTypes = {
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  formatText: PropTypes.func,
  formatEmpty: PropTypes.func,
  formatFirst: PropTypes.func,
  formatLast: PropTypes.func,
  buttonProps: PropTypes.object
}
