import React, {PureComponent, Fragment} from 'react'
import {clone} from 'utils/clone'
import Breakpoint from '@emcasa/ui-dom/components/Breakpoint'
import Row from '@emcasa/ui-dom/components/Col'
import {
  RoomsFilter,
  TypesFilter,
  PriceFilter,
  AreaFilter,
  GarageSpotsFilter
} from './bootstrap'

class ExpandedFilters extends PureComponent {
  onChange = (key, value) => {
    const newFilters = clone(this.props.filters)
    newFilters[key] = value
    this.props.onChange(newFilters)
  }

  render() {
    const {filters} = this.props
    return (
      <Breakpoint only="phone">
        <Row px={4}>
          <TypesFilter onChange={this.onChange} filters={filters} />
          <PriceFilter onChange={this.onChange} filters={filters} />
          <AreaFilter onChange={this.onChange} filters={filters} />
          <RoomsFilter onChange={this.onChange} filters={filters} />
          <GarageSpotsFilter onChange={this.onChange} filters={filters} />
        </Row>
      </Breakpoint>
    )
  }
}

export default ExpandedFilters
