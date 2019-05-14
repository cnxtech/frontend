import {Component} from 'react'
import Link from 'next/link'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import NeighborhoodPicker from 'components/shared/NeighborhoodPicker'
import {MobileTypeaheadContainer} from 'components/shared/NeighborhoodAutoComplete/styles'
import ScrollTracker from 'components/shared/ScrollTracker'
import {
  showHeader,
  hideHeader
} from 'lib/page'
import {
  log,
  BUYER_LANDING_SCROLL_25,
  BUYER_LANDING_SCROLL_50,
  BUYER_LANDING_SCROLL_75,
  BUYER_LANDING_SCROLL_100
} from 'lib/logging'
import {
  UnderlinedText,
  Container,
  Content
} from './styles'

class BuyListing extends Component {
  constructor(props) {
    super(props)
    this.openMobileAddressInput = this.openMobileAddressInput.bind(this)
    this.close = this.close.bind(this)
  }

  state = {
    showMobileAddressInput: false,
    addressFormatted: null,
  }

  openMobileAddressInput() {
    hideHeader()
    this.setState({showMobileAddressInput: true})
  }

  close() {
    showHeader()
    this.setState({showMobileAddressInput: false})
  }

  renderSearch() {
    return (
      this.props.isMobile ?
        <Col mb={4}>
          <NeighborhoodPicker
            fromHome
            onClick={this.openMobileAddressInput}
            fullscreen={this.state.showMobileAddressInput}
          />
        </Col>
      :
        <Col mb={2} width={1}>
          <NeighborhoodPicker
            fromHome
          />
      </Col>
    )
  }

  render() {
    if (this.state.showMobileAddressInput) {
      return (
        <MobileTypeaheadContainer justifyContent="center" p={4}>
          <Col width={1}>
            <NeighborhoodPicker
              mobile
              fromHome
              fullscreen
              onBackPressed={this.close}
            />
          </Col>
        </MobileTypeaheadContainer>
      )
    }

    return (
      <Container>
        <ScrollTracker
          onScroll25={() => {log(BUYER_LANDING_SCROLL_25)}}
          onScroll50={() => {log(BUYER_LANDING_SCROLL_50)}}
          onScroll75={() => {log(BUYER_LANDING_SCROLL_75)}}
          onScroll100={() => {log(BUYER_LANDING_SCROLL_100)}}
        />
        <Content>
          <Row justifyContent="center" px={[4,null,null,  0]}>
            <Col>
              <Text
                fontSize="xlarge"
                color="dark"
                fontWeight="bold"
                textAlign="center"
                style={{marginBottom: 0, marginTop: 0}}>
                {this.props.title}
              </Text>
            </Col>
          </Row>
          <Row justifyContent="center" px={[4,null,null,  0]}>
            <Col>
              <Text color="gray" style={{margin: '0.5em'}}>
                Comprar seu imóvel nunca foi tão fácil, informe o bairro ou cidade
                e comece a sua pesquisa
              </Text>
            </Col>
          </Row>
          <Row flexDirection={['column',null,null,  'row']} px={[4,null,null,  0]}>
            <Col width={1} mr={[0,null,null,  2]}>
              {this.renderSearch()}
            </Col>
          </Row>
          <Row justifyContent="center">
            <Col>
              <Link passHref href="/vender">
                <a>
                  <UnderlinedText color="pink">Você quer vender?</UnderlinedText>
                </a>
              </Link>
            </Col>
          </Row>
        </Content>
      </Container>
    )
  }
}

export default withBreakpoint()(BuyListing)
