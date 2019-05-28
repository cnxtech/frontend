import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import {clone} from 'utils/clone'
import Content from './components/Content'
import {ChangeTypeEnum} from './components/Content/changeTypes'
import theme from '@emcasa/ui'
import {Icon} from './styles'
import {DEFAULT_CITY} from 'utils/location-utils'

class Filter extends Component {
  constructor(props) {
    super(props)

    this.filterBackup = null
    this.state = {
      showContent: false,
      filters: clone(props.filters || {})
    }
  }

  componentDidMount() {
    if (!process.browser) {
      return false
    }
    window.addEventListener('keydown', this.handleEscapeButtonPressed)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscapeButtonPressed)
  }

  handleEscapeButtonPressed = (event) => {
    if (event.key === 'Escape' || event.keyCode === 8) {
      this.closeContent()
    }
  }

  closeContent = () => {
    this.applyBackup()
    this.setState({showContent: false})
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
    if (this.filterBackup) {
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
        <Button
          fontSize="small"
          noBorder
          link
          iconColor={theme.colors.pink}
          onClick={this.toggleContent}
        >
          <Icon />
          <Text inline>
            Filtros
          </Text>
        </Button>
        {this.state.showContent && (
          <Content
            onSubmit={this.onSubmit}
            onClose={this.toggleContent}
            onChange={this.onChange}
            onCleanup={this.onCleanup}
            filters={this.state.filters}
            currentCity={this.props.currentCity}
          />
        )}
      </Fragment>
    )
  }
}
Filter.defaultProps = {
  filters: {},
  currentCity: DEFAULT_CITY
}
Filter.propTypes = {
  filters: PropTypes.object,
  currentCity: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

export default Filter
