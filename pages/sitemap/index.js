import React, {Component, Fragment} from 'react'
import {getNeighborhoods} from 'services/neighborhood-api'
import theme from '@emcasa/ui'
import {ThemeProvider} from 'styled-components'
import {imageUrl} from 'utils/image_url'
import NextHead from 'components/shared/NextHead'
import Link from 'next/link'
import Text from '@emcasa/ui-dom/components/Text'
import View from '@emcasa/ui-dom/components/View'
import Container from './styles'

const slugify = require('slug')

export default class MyPage extends Component {
  static async getInitialProps() {
    const search = await getNeighborhoods().then(({data}) => data)

    return {
      search
    }
  }

  render() {
    const {search} = this.props
    const seoTitle = 'Mapa do Site | EmCasa'
    const seoDescription = 'Encontre Imóveis, Casas e Apartamentos à Venda no Rio de Janeiro em Ipanema, Leblon, Copacabana, Botafogo, Flamengo, Lagoa e toda Zona Sul ou São Paulo com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.'
    const seoImg = imageUrl('buy')
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <NextHead
            title={seoTitle}
            description={seoDescription}
            imageSrc={seoImg}
            imageWidth={'1476'}
            imageHeight={'838'}
            url={'https://www.emcasa.com/sitemap'}
          />
          <Container>
            <View px={5}>
              <Text as="h2" fontSize="xlarge" fontWeight="normal">Mapa do site</Text>
            </View>
            <ul>
              <li>
                <Link passHref href="/">
                  <a title="EmCasa">Página inicial</a>
                </Link>
              </li>
              <li>
                <Link passHref href="/listings" as="/imoveis">
                  <a title="Compre seu imóvel">Compre seu imóvel</a>
                </Link>
                <ul>
                  {search.neighborhoods.map((neighborhood) => (
                    <li key={neighborhood}>
                      <Link
                        passHref
                        href={`/listings/?bairros=${neighborhood}`}
                        as={`/imoveis/rj/rio-de-janeiro/${slugify(
                          neighborhood.toLowerCase()
                        )}`}
                      >
                        <a title={`Comprar imóvel: ${neighborhood}`}>
                          {neighborhood}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link passHref href="/listings/new-listing" as="/vender">
                  <a title="Venda seu imóvel">Venda seu imóvel</a>
                </Link>
              </li>
              <li>
                <Link passHref href="/avaliacao-imovel">
                  <a title="Avalie seu imóvel">Avalie seu imóvel</a>
                </Link>
              </li>
              <li>
                <Link passHref href="/corretor-parceiro-rj">
                  <a title="Seja um corretor parceiro no RJ">Seja um corretor parceiro no RJ</a>
                </Link>
              </li>
              <li>
                <Link passHref href="/corretor-parceiro-sp">
                  <a title="Seja um corretor parceiro em SP">Seja um corretor parceiro em SP</a>
                </Link>
              </li>
              <li>
                <Link passHref href="https://jobs.emcasa.com/">
                  <a title="Trabalhe Conosco">Trabalhe Conosco</a>
                </Link>
              </li>
              <li>
                <Link passHref href="http://blog.emcasa.com">
                  <a title="Blog">Blog</a>
                </Link>
              </li>
            </ul>
          </Container>
        </Fragment>
      </ThemeProvider>
    )
  }
}
