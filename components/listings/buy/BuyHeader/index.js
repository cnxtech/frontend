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
            Busque seu imóvel <TextHighlight>sem sair de casa</TextHighlight> e{' '}
            <TextHighlight>sem corretores</TextHighlight>{' '}
            <TextHighlight strokeWidth="3">empurrando imóveis</TextHighlight>.
          </Title>
          <Text fontSize={[1, null, null, 2]}>
            Visite imóveis através do <strong>Tour Virtual</strong> e fale com
            um dos nossos <strong>Especialistas</strong> de onde estiver.
          </Text>
        </Container>
      </Wrapper>
    )
  }
}

export default BuyHeader
