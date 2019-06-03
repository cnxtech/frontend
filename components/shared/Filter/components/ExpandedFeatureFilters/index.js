import React, {PureComponent} from 'react'
import {clone} from 'utils/clone'
import {isEqual} from 'lodash'
import Col from '@emcasa/ui-dom/components/Col'
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
    //If we are trying to insert the same value again that means that the user want to deselect the current value
    if (isEqual(newFilters[key], value)) {
      newFilters[key] = {}
    } else {
      newFilters[key] = value
    }
    this.props.onChange(newFilters)
  }

  render() {
    const {filters} = this.props
    return (
      <Col px={4}>
        <TypesFilter onChange={this.onChange} filters={filters} />
        <PriceFilter onChange={this.onChange} filters={filters} />
        <AreaFilter onChange={this.onChange} filters={filters} />
        <RoomsFilter onChange={this.onChange} filters={filters} />
        <GarageSpotsFilter onChange={this.onChange} filters={filters} />
      </Col>
    )
  }
}

export default ExpandedFilters
