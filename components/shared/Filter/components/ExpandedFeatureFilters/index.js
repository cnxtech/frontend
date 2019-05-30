import React, {PureComponent, Fragment} from 'react'
import {clone} from 'utils/clone'
import Breakpoint from '@emcasa/ui-dom/components/Breakpoint'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import {
  RoomsFilter,
  TypesFilter,
  PriceFilter,
  AreaFilter,
  GarageSpotsFilter
} from './bootstrap'
import{FiltersRow} from './styles'

class ExpandedFilters extends PureComponent {
  onChange = (key, value) => {
    const newFilters = clone(this.props.filters)
    newFilters[key] = value
    this.props.onChange(newFilters)
  }

  render() {
    const {filters} = this.props
    return (
      <Col px={4}>
        <TypesFilter onChange={this.onChange} filters={filters} />
        <Breakpoint up="tablet">
          <FiltersRow>
            <PriceFilter onChange={this.onChange} filters={filters} />
            <AreaFilter onChange={this.onChange} filters={filters} />
          </FiltersRow>
          <FiltersRow>
            <RoomsFilter onChange={this.onChange} filters={filters} />
            <GarageSpotsFilter onChange={this.onChange} filters={filters} />
          </FiltersRow>
        </Breakpoint>
        <Breakpoint only="phone">
          <PriceFilter onChange={this.onChange} filters={filters} />
          <AreaFilter onChange={this.onChange} filters={filters} />
          <RoomsFilter onChange={this.onChange} filters={filters} />
          <GarageSpotsFilter onChange={this.onChange} filters={filters} />
        </Breakpoint>
      </Col>
    )
  }
}

export default ExpandedFilters
