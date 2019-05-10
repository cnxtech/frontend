import {Component} from 'react'
import styled from 'styled-components'
import {breakpoint} from '@emcasa/ui/lib/styles'
import View from '@emcasa/ui-dom/components/View'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import BuyListing from 'components/listings/buy/BuyListing'
import Benefits from 'components/listings/shared/Benefits'
import Neighborhoods from 'components/listings/buy/Neighborhoods'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {
  sameAs,
  SchemaWebSite,
  SchemaRealEstateAgent,
  SchemaOrganization
} from 'constants/ld-json'
import {imageUrl} from 'utils/image_url'
import {
  log,
  BUYER_LANDING_PAGE,
  BUYER_LANDING_EXPLORE_LISTINGS
} from 'lib/logging'
import NextHead from 'components/shared/NextHead'
import {GET_DISTRICTS} from 'graphql/listings/queries'
import {Query} from 'react-apollo'

const Container = styled(View)`
  display: flex;
  flex-direction: column;
`

const Block = styled(View)`
  display: flex;
  flex: 1;
  min-height: 60vh;
  max-width: 100vw;
  overflow: hidden;
  padding-top: ${HEADER_HEIGHT}px;
  justify-content: center;
`

const MainBlock = styled(Block)`
  padding-top: 0px;
  min-height: 80vh;
  @media ${breakpoint.down('tablet')} {
    min-height: 100vh;
  }
`

const BASE_TITLE = 'Imóveis, Casas e Apartamentos à Venda'
const BASE_DESCRIPTION =
  'com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.'

const CONTENT = {
  all: {
    seoURL: 'http://www.emcasa.com',
    seoImg: imageUrl('buy'),
    seoTitle: `${BASE_TITLE} no Rio de Janeiro e São Paulo | EmCasa`,
    seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em toda Zona Sul ou em São Paulo ${BASE_DESCRIPTION}`,
    heroTitle: 'Quer comprar um imóvel?'
  },
  sp: {
    seoURL: 'http://www.emcasa.com/sao-paulo',
    seoImg: imageUrl('buy-sp'),
    seoTitle: `${BASE_TITLE} em São Paulo | EmCasa`,
    seoDescription: `Encontre ${BASE_TITLE} em São Paulo ${BASE_DESCRIPTION}`,
    heroTitle: 'Quer comprar um imóvel em São Paulo?'
  },
  rj: {
    seoURL: 'http://www.emcasa.com/rio-de-janeiro',
    seoImg: imageUrl('buy-rj'),
    seoTitle: `${BASE_TITLE} no Rio de Janeiro | EmCasa`,
    seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em Ipanema, Leblon, Copacabana, Botafogo, Flamengo, Lagoa e toda Zona Sul ${BASE_DESCRIPTION}`,
    heroTitle: 'Quer comprar um imóvel na zona sul do Rio de Janeiro?'
  }
}

class Buy extends Component {
  static async getInitialProps() {
    return {
      transparentHeader: true
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      pageWidth: process.browser ? window.innerWidth : 0
    }
  }

  onResize = () => {
    this.setState({pageWidth: window.innerWidth})
  }

  componentDidMount() {
    log(BUYER_LANDING_PAGE)
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    const {router, isMobile} = this.props
    const city = (router.query || {}).city || 'all'
    const {seoURL, seoTitle, seoDescription, seoImg, heroTitle} = CONTENT[city]
    const blockProps = {
      isMobile,
      pageWidth: this.state.pageWidth,
      city
    }

    const benefitsProps = {
      sectionTitle: 'Conheça as vantagens de comprar com a EmCasa',
      benefitsList: [
        {
          icon: 'suporte-financiamento',
          title: 'Financiamento e FGTS',
          description:
            'Tenha suporte para o financiamento do seu imóvel e retirada de FGTS'
        },
        {
          icon: 'tour-3d',
          title: 'Tour Virtual 3D',
          description:
            'Visite dezenas de imóveis sem sair de casa, economize tempo e encontre o imóvel perfeito'
        },
        {
          icon: 'assistencia-juridica',
          title: 'Sem dor de cabeça',
          description:
            'Aqui na EmCasa cuidamos de toda burocracia, contratos e documentação'
        }
      ],
      buttonHref: '/imoveis',
      buttonLabel: 'Explorar Imóveis',
      buttonClick: () => {
        log(BUYER_LANDING_EXPLORE_LISTINGS)
      },
      isMobile
    }

    return (
      <Query query={GET_DISTRICTS} ssr={true}>
        {({loading, error, data}) => {
          if (loading) return <div />
          if (error) return <div>{`Error! ${error.message}`}</div>

          return (
            <Container>
              <NextHead
                title={seoTitle}
                description={seoDescription}
                imageSrc={seoImg}
                imageWidth={'1476'}
                imageHeight={'838'}
                url={seoURL}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(SchemaWebSite)
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(SchemaRealEstateAgent)
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(SchemaOrganization)
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'http://schema.org',
                    '@type': 'WebPage',
                    '@id': 'https://www.emcasa.com/#webpage',
                    name: seoTitle,
                    description: seoDescription,
                    sameAs: sameAs,
                    url: 'https://www.emcasa.com'
                  })
                }}
              />
              <MainBlock>
                <BuyListing title={heroTitle} />
              </MainBlock>
              <Block>
                <Benefits {...benefitsProps} />
              </Block>
              {data && data.districts ? (
                <Block>
                  <Neighborhoods districts={data.districts} {...blockProps} />
                </Block>
              ) : null}
            </Container>
          )
        }}
      </Query>
    )
  }
}

export default withBreakpoint()(Buy)
