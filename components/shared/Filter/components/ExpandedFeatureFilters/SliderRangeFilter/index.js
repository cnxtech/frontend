import React, {PureComponent} from 'react'
import Slider from '@emcasa/ui-dom/components/Slider'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'

export default class SliderRange extends PureComponent {
  render() {
    const {
      range,
      onChange,
      initialValue,
      filters,
      formatValue,
      formatLabel,
      title,
      name
    } = this.props
    const currentValue = filters[name]
    const displayValue = Object.assign({}, currentValue || initialValue)
    if (isNaN(displayValue.min) || displayValue.min === null)
      displayValue.min = range[0]
    if (isNaN(displayValue.max) || displayValue.max === null)
      displayValue.max = range[1]
    return (
      <Row flexDirection="column" my={4}>
        <Col>
          <Row flexDirection="row" alignItems="center">
            <Text fontSize="small" fontWeight="bold">
              {title}
            </Text>
          </Row>
        </Col>
        <Col>
          <View pr={2} pl={2}>
            {formatLabel && (
              <Text
                fontSize="small"
                textAlign="center"
                style={{
                  margin: 0
                }}
              >
                {formatLabel(displayValue)}
              </Text>
            )}
            <Slider
              height="medium"
              range={range}
              initialValue={displayValue}
              formatValue={formatValue}
              onChange={({...value}) => {
                if (value.min === range[0]) value.min = undefined
                if (value.max === range[1]) value.max = undefined
                if (value.max === undefined && value.min === undefined)
                  onChange(name, undefined)
                else onChange(name, value)
              }}
              trackProps={{bg: 'disabled'}}
            >
              <Slider.Marker name="min" bg="blue" />
              <Slider.Marker name="max" trackProps={{bg: 'blue'}} bg="blue" />
            </Slider>
          </View>
        </Col>
      </Row>
    )
  }
}
