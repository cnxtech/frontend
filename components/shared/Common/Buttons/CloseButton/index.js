import Icon from '@emcasa/ui-dom/components/Icon'
import Container from './style'

const CloseButton = (props) =>
  <Container
    {...props}
    inline
    noBorder
    backgroundColor="transparent"
    iconColor={props.color}
  >
    <Icon name="times" />
  </Container>

export default CloseButton
