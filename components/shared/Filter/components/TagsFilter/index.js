import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Button from '@emcasa/ui-dom/components/Button'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import theme from '@emcasa/ui'

class TagsFilter extends Component {
  render() {
    const {title, tags, selected, onChange} = this.props
    return (
      <Row flexDirection="column" px={4}>
        <Col>
          <Row flexDirection="row" alignItems="center">
            <Fragment>
              <Text>{title}</Text>
              <Button link fontSize={theme.fontSizes[1]} onClick={() => {}}>
                Ver Todos
              </Button>
            </Fragment>
          </Row>
        </Col>
        <Col>
          <Button.Group
            strategy="multi"
            selectedValue={selected}
            onChange={onChange}
          >
            {tags.map((tag) => (
              <Button key={tag.value} mr={2} value={tag.value}>
                {tag.label}
              </Button>
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
