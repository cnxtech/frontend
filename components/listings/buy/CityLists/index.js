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
    const {city} = this.props

    const CONTENT = {
      saopaulo: {
        title: 'Imóveis à venda em São Paulo',
        highlights: [
          {
            stateSlug: 'sp',
            citySlug: 'sao-paulo',
            nameSlug: 'perdizes',
            name: 'Perdizes',
            preposition: 'em'
          },
          {
            stateSlug: 'sp',
            citySlug: 'sao-paulo',
            nameSlug: 'pinheiros',
            name: 'Pinheiros',
            preposition: 'em'
          },
          {
            stateSlug: 'sp',
            citySlug: 'sao-paulo',
            nameSlug: 'sumare',
            name: 'Sumaré',
            preposition: 'no'
          },
          {
            stateSlug: 'sp',
            citySlug: 'sao-paulo',
            nameSlug: 'sumarezinho',
            name: 'Sumarezinho',
            preposition: 'no'
          },
          {
            stateSlug: 'sp',
            citySlug: 'sao-paulo',
            nameSlug: 'vila-anglo-brasileira',
            name: 'Vila Anglo Brasileira',
            preposition: 'na'
          },
          {
            stateSlug: 'sp',
            citySlug: 'sao-paulo',
            nameSlug: 'vila-pompeia',
            name: 'Vila Pompéia',
            preposition: 'na'
          }
        ]
      },
      riodejaneiro: {
        title: 'Imóveis à venda no Rio de Janeiro',
        highlights: [
          {
            stateSlug: 'rj',
            citySlug: 'rio-de-janeiro',
            nameSlug: 'botafogo',
            name: 'Botafogo',
            preposition: 'em'
          },
          {
            stateSlug: 'rj',
            citySlug: 'rio-de-janeiro',
            nameSlug: 'copacabana',
            name: 'Copacabana',
            preposition: 'em'
          },
          {
            stateSlug: 'rj',
            citySlug: 'rio-de-janeiro',
            nameSlug: 'flamengo',
            name: 'Flamengo',
            preposition: 'no'
          },
          {
            stateSlug: 'rj',
            citySlug: 'rio-de-janeiro',
            nameSlug: 'ipanema',
            name: 'Ipanema',
            preposition: 'em'
          },
          {
            stateSlug: 'rj',
            citySlug: 'rio-de-janeiro',
            nameSlug: 'laranjeiras',
            name: 'Laranjeiras',
            preposition: 'em'
          },
          {
            stateSlug: 'rj',
            citySlug: 'rio-de-janeiro',
            nameSlug: 'leblon',
            name: 'Leblon',
            preposition: 'no'
          }
        ]
      }
    }

    const CITY_CONTENT = CONTENT[city.replace(/[^a-z]/g, '')]

    return (
      <Container>
        <Title fontSize="large" fontWeight="bold" as="h3">
          {CITY_CONTENT.title}
        </Title>
        <Row flexDirection="column">
          <SubTitle fontWeight="bold" as="h4">
            Bairros mais buscados
          </SubTitle>
          <HighlightsList>
            {CITY_CONTENT.highlights.map((item, index) => {
              return (
                <li key={index}>
                  <Link
                    passHref
                    href={`/imoveis/${item.stateSlug}/${item.citySlug}/${
                      item.nameSlug
                    }`}
                  >
                    <HighlightsLink>
                      <HighlightsImage
                        decoding="async"
                        src={`https://res.cloudinary.com/emcasa/image/upload/v1543531007/homepage/neighborhoods/${
                          item.citySlug
                        }/${item.nameSlug}`}
                        alt={`Imagem do bairro ${item.name}`}
                      />
                      <HighlightsLabel
                        color="white"
                        fontSize={1}
                        fontWeight="bold"
                      >
                        {item.name}
                      </HighlightsLabel>
                    </HighlightsLink>
                  </Link>
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
              {CITY_CONTENT.highlights.map((item, index) => {
                return (
                  <TypesListItem key={index}>
                    <Link
                      passHref
                      href={`/imoveis/${item.stateSlug}/${item.citySlug}/${
                        item.nameSlug
                      }/apartamento`}
                    >
                      <TypesListLink>{`Apartamentos ${item.preposition} ${
                        item.name
                      }`}</TypesListLink>
                    </Link>
                  </TypesListItem>
                )
              })}
            </TypesList>
            <TypesList>
              {CITY_CONTENT.highlights.map((item, index) => {
                return (
                  <TypesListItem key={index}>
                    <Link
                      passHref
                      href={`/imoveis/${item.stateSlug}/${item.citySlug}/${
                        item.nameSlug
                      }/casa`}
                    >
                      <TypesListLink>{`Casas ${item.preposition} ${
                        item.name
                      }`}</TypesListLink>
                    </Link>
                  </TypesListItem>
                )
              })}
            </TypesList>
            <TypesList>
              {CITY_CONTENT.highlights.map((item, index) => {
                return (
                  <TypesListItem key={index}>
                    <Link
                      passHref
                      href={`/imoveis/${item.stateSlug}/${item.citySlug}/${
                        item.nameSlug
                      }/cobertura`}
                    >
                      <TypesListLink>{`Coberturas ${item.preposition} ${
                        item.name
                      }`}</TypesListLink>
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
