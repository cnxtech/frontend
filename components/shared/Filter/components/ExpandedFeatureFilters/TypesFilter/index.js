import React from 'react'
import stubTrue from 'lodash/fp/stubTrue'
import isEmpty from 'lodash/isEmpty'
import cond from 'lodash/fp/cond'
import join from 'lodash/fp/join'
import ButtonGroupFilter from '../ButtonGroupFilter'
import {FilterButton} from '../shared/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'

const TypesFilter = ({
  buttonProps,
  title,
  onChange,
  name,
  filters,
  ...props
}) => (
  <Row flexDirection="column">
    <Col>
      <Row flexDirection="row" alignItems="center">
        <Text fontSize="small" fontWeight="bold">
          {title}
        </Text>
      </Row>
    </Col>
    <Col>
      <ButtonGroupFilter
        strategy="multi"
        isEmpty={isEmpty}
        onChange={(value) => {
          onChange(name, value)
        }}
        name={name}
        currentValue={filters[name]}
        {...props}
      >
        <FilterButton {...buttonProps} value="Casa">
          Casa
        </FilterButton>
        <FilterButton {...buttonProps} value="Apartamento">
          Apartamento
        </FilterButton>
        <FilterButton {...buttonProps} value="Cobertura">
          Cobertura
        </FilterButton>
      </ButtonGroupFilter>
    </Col>
  </Row>
)

TypesFilter.defaultProps = {
  name: 'types',
  formatLabel: cond([
    [isEmpty, () => 'Tipos de imóvel'],
    [stubTrue, join(', ')]
  ]),
  title: 'Tipos de imóveis',
  buttonProps: {}
}

export default TypesFilter
