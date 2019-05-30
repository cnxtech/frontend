import Icon from '@emcasa/ui-dom/components/Icon'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'

export default function ActionButton({icon, iconType, color, size}) {
  return (
    <Row>
      <Icon mr={2} name={icon} type={iconType} color={color} size={size} />
      <Text>
    </Row>
  )
}

ActionButton.defaultProps = {
  size: 16
}
