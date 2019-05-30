import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Button from '@emcasa/ui-dom/components/Button'
import Col from '@emcasa/ui-dom/components/Col'
import {Separator, Container, Footer, ApplyButton} from './styles'
import NeighborhoodFilter from '../NeighborhoodFilter'
import FeatureFilter from '../FeatureFilter'
import ExpandedFeatureFilters from '../ExpandedFeatureFilters'
import TagsFilter from '../TagsFilter'
import Modal from '../Modal'
import {infraestrutura, beneficios} from '../TagsFilter/constansts'
import {zIndexFooterFilterModal} from 'constants/zIndex'
import {ChangeTypeEnum} from './changeTypes'

class Content extends Component {
  constructor(props) {
    super(props)
  }

  changeLocation = (data) => {
    this.props.onChange({type: ChangeTypeEnum.LOCATION, data})
  }

  changeFeature = (data) => {
    this.props.onChange({type: ChangeTypeEnum.FEATURE, data})
  }

  changeTags = (data) => {
    this.props.onChange({type: ChangeTypeEnum.TAGS, data})
  }

  render() {
    const {onClose, filters, currentCity} = this.props
    return (
      <Modal width="100%" onClose={onClose}>
        <Container flexDirection="column">
          <NeighborhoodFilter
            onChange={this.changeLocation}
            currentCity={currentCity}
            neighborhoods={filters.neighborhoods}
          />
          <FeatureFilter onChange={this.changeFeature} values={filters} />
          <ExpandedFeatureFilters
            onChange={this.changeFeature}
            filters={filters}
          />
          <TagsFilter
            onChange={this.changeTags}
            tags={infraestrutura}
            selected={filters.tagsSlug || []}
            title="Infraestrutura"
          />
          <Col mt={4}>
            <Separator px={4} />
            <Footer zIndex={zIndexFooterFilterModal} p={4} justifyContent="flex-end">
              <Button mr={2} onClick={this.props.onCleanup}>
                Limpar
              </Button>
              <ApplyButton active onClick={this.props.onSubmit}>
                Mostrar resultados
              </ApplyButton>
            </Footer>
          </Col>
        </Container>
      </Modal>
    )
  }
}

Content.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCleanup: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  currentCity: PropTypes.object.isRequired
}

export default Content
