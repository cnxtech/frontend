import {Component} from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import {isMobile} from 'lib/mobile'
import AddressAutoComplete from 'components/shared/AddressAutoComplete'
import MobileAddressButton from 'components/shared/MobileAddressButton'

import {
  UnderlinedText,
  Container,
  Content
} from './styles'

export default class SellListing extends Component {
  constructor(props) {
    super(props)
    this.openMobileAddressInput = this.openMobileAddressInput.bind(this)
  }

  state = {
    addressFormatted: null,
    addressData: null
  }

  openMobileAddressInput() {
    
  }

  render() {
    return (
      <Container>
        <Content>
          <Row justifyContent="center">
            <Col>
              <Text fontSize="xlarge" color="dark" fontWeight="bold" textAlign="center">
                Quer vender seu imóvel?
              </Text>
            </Col>
          </Row>
          <Row justifyContent="center">
            <Col>
              <Text color="gray">
                Vender seu imóvel nunca foi tão fácil, informe o endereço do seu imóvel
                e receba agora uma avaliação grátis
              </Text>
            </Col>
          </Row>
          <Row flexDirection={['column', 'row']}>
            <Col width={[1, 10 / 12]} mr={[0, 2]} mb={[4, 0]}>
              {isMobile() ?
                <Col mb={4}>
                  <MobileAddressButton
                    onClick={this.openMobileAddressInput}
                    address={this.state.address}
                  />
                </Col>
              :
                <Col mb={4}>
                  <AddressAutoComplete
                    searchResultsMargin={4}
                    defaultValue={this.state.address}
                    onClearInput={this.onClearInput}
                    onSelectAddress={(addressFormatted, addressData) => {
                      this.setState({
                        addressFormatted,
                        addressData
                      })
                    }}
                  />
                </Col>
              }
            </Col>
            <Col width={[1, 2 / 12]}>
              <Button height="tall" active fluid onClick={() => {
                localStorage.setItem('sellerAddressFormatted', this.state.addressFormatted)
                localStorage.setItem('sellerAddressData', JSON.stringify(this.state.addressData))
                Router.push('/vender/imovel')
              }}>
                Avaliar
              </Button>
            </Col>
          </Row>
          <Row justifyContent="center">
            <Col>
              <Link href="/">
                <UnderlinedText color="pink">Você quer comprar?</UnderlinedText>
              </Link>
            </Col>
          </Row>
        </Content>
      </Container>
    )
  }
}
