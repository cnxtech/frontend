import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Button from '@emcasa/ui-dom/components/Button'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSlidersHSquare from '@fortawesome/fontawesome-pro-regular/faSlidersHSquare'
import {ButtonText} from './styles'
import {clone} from 'utils/clone'
import Content from './components/Content'
import {ChangeTypeEnum} from './components/Content/changeTypes'

class Filter extends Component {
  constructor(props) {
    super(props)

    this.filterBackup = null
    this.state = {
      showContent: false,
      filters: clone(props.filters || {})
    }
  }

  toggleContent = () => {
    if (!this.state.showContent) {
      this.createBackup()
    } else {
      this.applyBackup()
    }
    this.setState({showContent: !this.state.showContent})
  }

  createBackup = () => {
    this.filterBackup = clone(this.state.filters)
  }

  cleanBackup = () => {
    this.filterBackup = null
  }

  applyBackup = () => {
    if(this.filterBackup){
      this.setState({filters: this.filterBackup}, this.cleanBackup)
    }
  }

  onChange = (payload) => {
    switch (payload.type) {
      case ChangeTypeEnum.TAGS: {
        this.setState({
          filters: {...this.state.filters, ...{tagsSlug: payload.data}}
        })
        break
      }
      case ChangeTypeEnum.FEATURE: {
        this.setState({filters: {...payload.data}})
        break
      }
      case ChangeTypeEnum.LOCATION: {
        const {data} = payload
        const newLocationFilter = {...this.state.filters}
        delete newLocationFilter.neighborhoods
        delete newLocationFilter.citySlug
        if (data.city) {
          newLocationFilter.citySlug = data.city.citySlug
          newLocationFilter.stateSlug = data.city.stateSlug
        }
        if (data.neighborhoods) {
          newLocationFilter.neighborhoods = data.neighborhoods
        }
        this.setState({filters: newLocationFilter})
      }
    }
  }

  onSubmit = () => {
    this.cleanBackup()
    this.props.onSubmit(clone(this.state.filters))
    this.toggleContent()
  }

  onCleanup = () => {
    this.cleanBackup()
    const {citySlug, stateSlug} = this.state.filters
    this.props.onSubmit({citySlug, stateSlug})
    this.setState({filters: {citySlug, stateSlug}})
    this.toggleContent()
  }

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggleContent}>
          <FontAwesomeIcon icon={faSlidersHSquare} />
          <ButtonText>Filtros</ButtonText>
        </Button>
        {this.state.showContent && (
          <Content
            onSubmit={this.onSubmit}
            onClose={this.toggleContent}
            onChange={this.onChange}
            onCleanup={this.onCleanup}
            filters={this.state.filters}
          />
        )}
      </Fragment>
    )
  }
}

Filter.propTypes = {
  filters: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

export default Filter
