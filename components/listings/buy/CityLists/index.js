import {Component} from 'react'
import Link from 'next/link'
import theme from '@emcasa/ui'
import {
  Container,
  Title,
  SubTitle,
  HighlightsList,
  HighlightsLink,
  HighlightsImage,
  HighlightsLabel,
  TypesListGrid,
  TypesList,
  TypesListItem,
  TypesListLink
} from './styles'
import Row from '@emcasa/ui-dom/components/Row'

class CityLists extends Component {
  render() {
    const HIGHLIGHTS = [
      {
        nameSlug: 'perdizes',
        name: 'Perdizes'
      },
      {
        nameSlug: 'pinheiros',
        name: 'Pinheiros'
      },
      {
        nameSlug: 'sumare',
        name: 'Sumaré'
      },
      {
        nameSlug: 'sumarezinho',
        name: 'Sumarezinho'
      },
      {
        nameSlug: 'vila-anglo-brasileira',
        name: 'Vila Anglo Brasileira'
      },
      {
        nameSlug: 'pompeia',
        name: 'Vila Pompéia'
      }
    ]

    const APARTAMENTOS = [
      'Apartamentos em Perdizes',
      'Apartamentos em Pinheiros',
      'Apartamentos no Sumaré ',
      'Apartamentos no Sumarezinho',
      'Apartamentos na Vila Anglo Brasileira',
      'Apartamentos na Vila Pompéia'
    ]

    const CASAS = [
      'Casas em Perdizes',
      'Casas em Pinheiros',
      'Casas no Sumaré ',
      'Casas no Sumarezinho',
      'Casas na Vila Anglo Brasileira',
      'Casas na Vila Pompéia'
    ]

    const COBERTURAS = [
      'Coberturas em Perdizes',
      'Coberturas em Pinheiros',
      'Coberturas no Sumaré ',
      'Coberturas no Sumarezinho',
      'Coberturas na Vila Anglo Brasileira',
      'Coberturas na Vila Pompéia'
    ]

    return (
      <Container>
        <Title fontSize="large" fontWeight="bold" as="h3">
          Imóveis à venda no Rio de Janeiro e São Paulo
        </Title>
        <Row flexDirection="column">
          <SubTitle fontWeight="bold" as="h4">
            Bairros mais buscados
          </SubTitle>
          <HighlightsList>
            {HIGHLIGHTS.map((item, index) => {
              return (
                <li key={index}>
                  <HighlightsLink href="/new-home">
                    <HighlightsImage
                      decoding="async"
                      src={`https://res.cloudinary.com/emcasa/image/upload/v1543531007/bairros/${
                        item.nameSlug
                      }`}
                      alt={`Imagem do bairro ${item.name}`}
                    />
                    <HighlightsLabel>{item.name}</HighlightsLabel>
                  </HighlightsLink>
                </li>
              )
            })}
          </HighlightsList>
        </Row>
        <Row flexDirection="column" my={[theme.space[5] * 2, null, null, 6]}>
          <SubTitle fontWeight="bold" as="h4">
            Bairros por tipo de imóvel
          </SubTitle>
          <TypesListGrid>
            <TypesList>
              {APARTAMENTOS.map((item, index) => {
                return (
                  <TypesListItem key={index}>
                    <Link passHref href="/imoveis">
                      <TypesListLink href="/">{item}</TypesListLink>
                    </Link>
                  </TypesListItem>
                )
              })}
            </TypesList>
            <TypesList>
              {CASAS.map((item, index) => {
                return (
                  <TypesListItem key={index}>
                    <Link passHref href="/imoveis">
                      <TypesListLink href="/">{item}</TypesListLink>
                    </Link>
                  </TypesListItem>
                )
              })}
            </TypesList>
            <TypesList>
              {COBERTURAS.map((item, index) => {
                return (
                  <TypesListItem key={index}>
                    <Link passHref href="/imoveis">
                      <TypesListLink href="/">{item}</TypesListLink>
                    </Link>
                  </TypesListItem>
                )
              })}
            </TypesList>
          </TypesListGrid>
        </Row>
      </Container>
    )
  }
}

export default CityLists
