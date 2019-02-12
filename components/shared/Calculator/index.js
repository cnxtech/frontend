import {Component} from 'react'
import Slider from 'components/shared/Common/Slider'
import NumberFormat from 'react-number-format'
import Container, {
  SliderContainer,
  Description,
  InfoContainer,
  Info,
  Table,
  DescriptionColumn,
  Column,
  Buttons
} from './styles'
import Link from 'next/link'
import EmCasaButton from 'components/shared/Common/Buttons'
import ContactButton from 'components/shared/Common/Contact'
import {
  log,
  CALCULATOR_USED
} from 'lib/logging'

export default class Calculator extends Component {
  state = {
    listingValue: 400,
    used: false
  }
  sliderChanged = ({maxValue}, userClicked) => {
    const {used} = this.state
    this.setState({listingValue: maxValue, used: userClicked})

    if (!used && userClicked) {
      log(CALCULATOR_USED)
    }
  }

  getSellerEconomy = () => {
    const {listingValue} = this.state
    return Math.round(1.2 / 100 * listingValue + 3400)
  }

  getBuyerEconomy = () => {
    const {listingValue} = this.state
    return Math.round(0.8 / 100 * listingValue + 2400)
  }
  render() {
    const {listingValue} = this.state
    return (
      <Container>
        <h3>Veja quanto você pode economizar com a EmCasa</h3>
        <Description>
          Confira sua economia desfrutando do serviço excepcional <br /> EmCasa
          e economize milhares de reais em taxas.
        </Description>
        <InfoContainer>
          <Info>
            <p>Economia para quem vende</p>
            <NumberFormat
              value={this.getSellerEconomy()}
              displayType={'text'}
              thousandSeparator={'.'}
              decimalSeparator={','}
            />
          </Info>
          <Info>
            <p>Economia para quem compra</p>
            <NumberFormat
              value={this.getBuyerEconomy()}
              displayType={'text'}
              thousandSeparator={'.'}
              decimalSeparator={','}
            />
          </Info>
        </InfoContainer>
        <SliderContainer>
          <Slider
            min={400000}
            max={4000000}
            showValue
            onChange={this.sliderChanged}
            showTutorial
            valuesFormatter={(value) => ` R$ ${value.toLocaleString('pt-BR')}`}
            valuesRounder={(value) => Math.ceil(value / 10000) * 10000}
          />
        </SliderContainer>
        <Description>
          Ajuste conforme o valor do seu imóvel e confira a <br />
          economia pra quem vende e para quem compra
        </Description>
        <Table>
          <DescriptionColumn>
            <h4>Descrição</h4>
            <p>Valor do seu imóvel</p>
            <p>Corretagem Imobiliária</p>
            <p>Equipe disponível</p>
            <p>Tempo para o imóvel estar disponível</p>
            <p>Fotos profissionais</p>
            <p>Tour 3D</p>
            <p>Destaques nos portais de imóveis</p>
            <p>Destaque no Facebook e Google</p>
            <p>Assessoria jurídica e de documentação</p>
            <p>Suporte em financiamento e retirada de FGTS</p>
            <p>Valor recebido pelo proprietário</p>
          </DescriptionColumn>
          <Column secondary>
            <h4>EmCasa</h4>
            <p> R$ {listingValue.toLocaleString('pt-BR')}</p>
            <p>
              R$ {Math.round(3 / 100 * listingValue).toLocaleString('pt-BR')}*
            </p>
            <p>Atendimento 24 horas</p>
            <p>1 dia</p>
            <p>Gratuito</p>
            <p>Gratuito</p>
            <p>Gratuito</p>
            <p>Gratuito</p>
            <p>Gratuito</p>
            <p>Gratuito</p>
            <p>
              R$ {Math.round(97 / 100 * listingValue).toLocaleString('pt-BR')}
            </p>
          </Column>
          <Column>
            <h4>Imobiliárias Tradicionais</h4>
            <p> R$ {listingValue.toLocaleString('pt-BR')}</p>
            <p>
              R$ {Math.round(5 / 100 * listingValue).toLocaleString('pt-BR')}**
            </p>
            <p>1 corretor</p>
            <p>7 dias</p>
            <p>Câmeras amadoras</p>
            <p>—</p>
            <p>—</p>
            <p>—</p>
            <p>—</p>
            <p>—</p>
            <p>
              R$ {Math.round(95 / 100 * listingValue).toLocaleString('pt-BR')}
            </p>
          </Column>
        </Table>
        <Buttons>
          <Link href="/listings/new" as="/imoveis/adicionar">
            <EmCasaButton light>Anuncie agora</EmCasaButton>
          </Link>
          <ContactButton />
        </Buttons>
      </Container>
    )
  }
}
