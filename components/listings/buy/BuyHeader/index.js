import {Component} from 'react'
import theme from '@emcasa/ui'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import {Wrapper, Container, Title} from './styles'

class BuyHeader extends Component {
  render() {
    return (
      <Wrapper>
        <Container>
          <Title fontWeight="bold">
            Busque seu imóvel sem sair de casa e sem corretores empurrando
            imóveis.
          </Title>
          <Text textAlign="center" fontSize="small">
            Visite imóveis através do <strong>Tour Virtual</strong> e fale com um
            dos nossos <strong>Especialistas</strong> de onde estiver.
          </Text>
        </Container>
      </Wrapper>
    )
  }
}

export default BuyHeader
