import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Button from '@emcasa/ui-dom/components/Button'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import {ButtonFilter} from './styles'

class TagsFilter extends Component {
  render() {
    const {title, tags, selected, onChange} = this.props
    return (
      <Row flexDirection="column" px={4}>
        <Col>
          <Row flexDirection="row" alignItems="center">
            <Fragment>
              <Text fontWeight="bold" fontSize="small">
                {title}
              </Text>
            </Fragment>
          </Row>
        </Col>
        <Col>
          <Button.Group
            flexWrap="wrap"
            strategy="multi"
            selectedValue={selected}
            onChange={onChange}
          >
            {tags.map((tag) => (
              <ButtonFilter
                fontSize="small"
                value={tag.value}
                mr={2}
                mb={2}
                key={tag.value}
              >
                {tag.label}
              </ButtonFilter>
            ))}
          </Button.Group>
        </Col>
      </Row>
    )
  }
}

TagsFilter.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  selected: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

TagsFilter.defaultProps = {
  selected: []
}

export default TagsFilter
