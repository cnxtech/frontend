import {Component} from 'react'
import Text from '@emcasa/ui-dom/components/Text'
import {Wrapper, Container, Title} from './styles'
import TextHighlight from './TextHighlight'

class BuyHeader extends Component {
  render() {
    return (
      <Wrapper>
        <Container>
          <Title as="h2" fontWeight="bold" fontSize={[2, null, null, 4]}>
            Deixe <TextHighlight>nossos especialistas</TextHighlight> encontrarem o imóvel ideal para você.
          </Title>
        </Container>
      </Wrapper>
    )
  }
}

export default BuyHeader
