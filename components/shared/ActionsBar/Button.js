import Icon from '@emcasa/ui-dom/components/Icon'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'

export default function ActionButton({
  onClick,
  href,
  label,
  icon,
  iconType,
  color,
  size
}) {
  return (
    <Row
      as="a"
      onClick={onClick}
      href={href}
      mr={2}
      alignItems="center"
      style={{cursor: 'pointer'}}
    >
      <Icon mr={2} name={icon} type={iconType} color={color} size={size} />
      <Text fontSize="small">{label}</Text>
    </Row>
  )
}

ActionButton.defaultProps = {
  color: 'blue',
  size: 16
}
